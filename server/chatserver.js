var util = require("util"),

    io = require("socket.io"),
    log4js = require("log4js");

var db = require("./resource/mongodb")

var logger = log4js.getLogger(__filename);
var users = {},
    users_client = {};

exports.setup = function( app ){
    var chat = io.listen(app).of("/chat");
    chat.authorization(function( data, fn ){
        var cookie = data.headers ? data.headers.cookie : "",
            sid;
        if( cookie && cookie.match(/sid=([^;]+)/) ){
            sid = RegExp.$1;
        }
        logger.debug("get session info: " + sid);
        db.collection("session").findOne({_id: sid}, function(err, session){
            if( err ) return fn( "500", false );
            if( !session ) return fn( "No session info.", false );
            
            db.collection("user").findOne({_id: session.uid}, function(err, user){
                if( err ) return fn( "500", false );
                if( !session ) return fn( "No user info.", false );
                logger.debug("get user passport: " + user.passport + ", name: " + user.name);
                data.passport = user.passport;
                data.name = user.name;
                fn( null, true );
            });
        });
    });
    chat.on("connection", function( socket ){
        var handshaken = socket.manager.handshaken[socket.id];
        var pt = socket.passport = handshaken.passport;
        var name = socket.name = handshaken.name;
        
        if( users[pt] && users[pt].socket ){
            logger.info( users[pt].passport, " logined in another place.");
            users[pt].socket.emit("msg", "您已经在另一个地方登录。");
            users[pt].socket.disconnect()
        }
        socket.broadcast.emit("user-login", {"passport": pt, "name": name});
        users_client[pt] = name;
        users[pt] = {"passport": pt, "name": name, "socket": socket};
        
        socket.on("user-list", function(){
            socket.emit("user-list", users_client);
        });
        socket.on("msg", function( msg ){
            if( !msg.msg || !msg.to ) return;
            // XSS
            msg.msg = msg.msg.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
            
            var to = msg.to;
            msg.toname = users_client[to];
            msg.from = socket.passport;
            msg.fromname = socket.name;
            if( to === "all" ){
                chat.emit("msg", msg);
            }else{
                if( !users[to] || !users[to].socket){
                    return socket.emit("user-offline", msg.toname);
                }
                socket.emit("msg", msg);
                users[to].socket.emit("msg", msg);
            }
        });
        
        function exit(){
            var pt = socket.passport;
            socket.broadcast.emit("user-logout", {passport: pt, name: socket.name})
            delete users[pt];
            delete users_client[pt];
        }
        socket.on("logout", function(){
            socket.emit("disconnect");
            socket.disconnect();
        });
        socket.on("disconnect", exit);
    });
}
