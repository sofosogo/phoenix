var io = require("socket.io"),
    log4js = require("log4js");

var db = require("./resource/mongodb")

var logger = log4js.getLogger(__filename);
var users = {},
    users_client = {};

exports.setup = function( app ){
    var sockets = io.listen(app).sockets;
    sockets.on("connection", function( socket ){
        
        socket.on("sid", function( sid ){
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
                    socket.emit("login", users_client);
                    socket.broadcast.emit("user-added", {"passport": pt, "name": name});
                    users[pt] = {"passport": pt, "name": name, "socket": socket};
                    users_client[pt] = name;
                });
            });
        });
        
        socket.on("msg", function( msg ){
            // validate
            var to = msg.to;
            if( to === "all" ){
                sockets.emit("msg", msg);
            }else{
                if( !users[to] || !users[to].socket){
                    return socket.emit("users-offline", msg.toname);
                }
                socket.emit("msg", msg);
                users[to].socket.emit("msg", msg);
            }
        });
        
        socket.on("disconnect", function(){
            var pt = socket.passport;
            delete users[pt];
            delete users_client[pt];
            socket.broadcast.emit("user-removed", {passport: pt})
        });
    });
}
