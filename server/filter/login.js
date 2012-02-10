var url = require("url"),
    
    db = require("../resource/mongodb"),
    error = require("../error");
    
var logger = require("log4js").getLogger(__filename);

function condition(req, res){
    var pathname = url.parse( req.url ).pathname;
    //if( pathname.match(/\/user|clothes\/.*/) ) return true;
    return false;
}

exports.filter = function(req, res, next){
    if( !condition(req, res) ) return next();
    
    logger.info("start");
    var sid = req.cookies.get("sid");
    db.collection("session").findOne({_id: sid}, function(err, session){
        if( err ) return error.throw(res, 500);
        if( !session ) return error.throw(res, 501);
        req.session = session;
        logger.info("end");
        next();
    });
}
