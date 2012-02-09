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
    
exports.filter = function(req, res, next){
    if( !condition(req, res) ) return next();
    
    var method = req.method.toLowerCase(),
        uri = url.parse( req.url );
        
    req.params = req.params = querystring.parse( uri.query );
    
    if( method === "get" ){
        logger.info( util.inspect(req.params) );
        next();
    }else{
        var form = new formidable.IncomingForm();
        form.uploadDir = path.resolve("./web/upload/temp/");
        form.on("error", function(err) {
                console.log("Error when parse data:\n\n" + util.inspect(err));
                error.throw(res, 500);
            })
            .on("field", function(field, value){
                if( field.indexOf("[]") !== -1 ){
                    field = field.replace("[]", "");
                    if( typeof value === "string" ) value = [value];
                }
                req.params[field] = value;
            })
            .on('file', function(field, file){
                req.params[field] = file;
            })
            .on("end", function(){
                logger.info( util.inspect(req.params) );
                next();
            })
        .parse(req);
    }
}
