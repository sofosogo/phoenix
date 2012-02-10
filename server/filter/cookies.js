var Cookies = require("cookies");

var logger = require("log4js").getLogger(__filename);

exports.filter = function(req, res, next){
    logger.info("start");
    req.cookies = new Cookies(req, res);
    logger.info("end");
    next();
}
