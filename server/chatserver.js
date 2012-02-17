var io = require("socket.io"),
    log4js = require("log4js");

var db = require("./resource/mongodb")

var logger = log4js.getLogger(__filename);
var users = {},
    users_client = {};

exports.setup = function( app ){
    var sockets = io.listen(app).sockets;
    sockets.on("connection", function( socket ){
        
        socket.on("login", function( sid ){
            logger.debug("get session info: " + sid);
            db.collection("session").findOne({_id: sid}, function(err, session){
                if( err ) logger.error( err );
                var uid = session.uid;
                logger.debug("get user id: " + uid);
                db.collection("user").findOne({_id: uid}, function(err, user){
                    if( err ) logger.error( err );
                    var pt = user.passport,
                        name = user.name;
                    logger.debug("get user passport: " + pt + ", name: " + name);
                    socket.passport = pt;
                    socket.name = name;
                    socket.emit("login", users_client);
                    socket.broadcast.emit("user-login", {"passport": pt, "name": name});
                    users[pt] = {"passport": pt, "name": name, "socket": socket};
                    users_client[pt] = name;
                });
            });
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
                sockets.emit("msg", msg);
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
            socket.destroy();
        }
        socket.on("logout", function(){
            exit();
            socket.emit("disconnect");
        });
        socket.on("disconnect", exit);
    });
}
