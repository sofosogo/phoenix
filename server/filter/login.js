var url = require("url"),
    
    db = require("../resource/mongodb"),
    error = require("../error");

function condition(req, res){
    var pathname = url.parse( req.url ).pathname;
    if( pathname.match(/\/user\/.*/) ) return true;
    return false;
}

exports.filter = function(req, res, next){
    if( !condition(req, res) ) return next();
    
    console.log("Checking login state");
    var sid = req.cookies.get("sid");
    db.collection("session").findOne({_id: sid}, function(err, session){
        if( err ) throw err;
        if( !session ) return error.throw(res, 501);
        req.session = session;
        next();
    });
}
