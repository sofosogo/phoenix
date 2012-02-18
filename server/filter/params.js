var http = require("http"),
    url = require("url"),
    util = require('util'),
    path = require("path"),
    querystring = require("querystring"),
    
    formidable = require('formidable'),
    
    error = require("../error");
var logger = require("log4js").getLogger(__filename);

function condition(req, res){
    var pathname = url.parse( req.url ).pathname;
    if( pathname.match(/^\/upload$/) ) return false;
    return true;
}

function handleParams( req, next ){
    var params = req.params,
        field, value;
    if( params ){
        for( var field in params ){
            value = params[field];
            if( field.indexOf("[]") !== -1 ){
                delete params[field];
                field = field.replace("[]", "");
                if( typeof value === "string" ) value = [value];
                params[field] = value;
            }else if( field.match(/([a-z0-9]+)\[([a-z0-9]+)\]/i) ){
                delete params[field];
                if( !params[RegExp.$1] ) params[RegExp.$1] = {};
                params[RegExp.$1][RegExp.$2] = value;
            }
        }
    };
    logger.info( util.inspect(params) );
    logger.info("end");
    next();
}
    
exports.filter = function(req, res, next){
    if( !condition(req, res) ) return next();
    
    logger.info("start");
    
    var method = req.method.toLowerCase(),
        uri = url.parse( req.url );
        
    req.params = req.params = querystring.parse( uri.query );
    
    if( method === "get" ){
        handleParams(req, next);
    }else{
        var form = new formidable.IncomingForm();
        form.uploadDir = path.resolve("./web/upload/temp/");
        form.on("error", function(err) {
                console.log("Error when parse data:\n\n" + util.inspect(err));
                error.throw(res, 500);
            })
            .on("field", function(field, value){
                req.params[field] = value;
            })
            .on('file', function(field, file){
                req.params[field] = file;
            })
            .on("end", function(){
                handleParams(req, next);
            })
        .parse(req);
    }
}
