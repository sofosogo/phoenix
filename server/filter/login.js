var url = require("url"),
    
    error = require("../error");

function condition(req, res){
    var pathname = url.parse( req.url ).pathname;
    if( pathname.match(/\/user\/.*/) ) return true;
    return false;
}

exports.filter = function(req, res, next){
    if( condition(req, res) ){
        console.log("Checking login state");
        if( !req.cookies.get("sid") ){
            console.error("Need Login");
            return error.throw(res, 501);
        }
    }
    next();
}
