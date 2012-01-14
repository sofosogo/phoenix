var Cookies = require("cookies");

exports.filter = function(req, res, next){
    req.cookies = new Cookies(req, res);
    next();
}
