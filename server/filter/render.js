var url = require("url");

var logger = require("log4js").getLogger(__filename);

var extname_pattern = /^(.*)\.(json|html|xml)$/i;

var renders = {
    "json": function ( json ){
        this.end( JSON.stringify(json) );
    },
    "html": function( json ){
        this.end( "JSON.stringify(json)" );
    },
    "xml": function( json ){
        this.end( JSON.stringify(json) );
    }
}

exports.filter = function(req, res, next){
    var pathname = url.parse( req.url ).pathname;
    var extname = "json",
        real_url;
    if( pathname.match(extname_pattern) ){
        extname = RegExp.$2.toLowerCase();
        real_url = RegExp.$1;
        req.url = req.url.replace(pathname, real_url);
        res.temp = 
        logger.info("extname = ", RegExp.$2);
        logger.info("Change pathname from %s to %s", pathname, real_url);
    }
    res.render = renders[extname];
    next();
}