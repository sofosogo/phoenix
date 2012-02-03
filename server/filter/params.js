var http = require("http"),
    url = require("url"),
    util = require('util'),
    querystring = require("querystring"),
    
    formidable = require('formidable'),
    
    error = require("../error");

function condition(req, res){
    var pathname = url.parse( req.url ).pathname;
    if( pathname.match(/\/upload/) ) return false;
    return true;
}
    
exports.filter = function(req, res, next){
    if( !condition(req, res) ) return next();
    
    var method = req.method.toLowerCase(),
        uri = url.parse( req.url );
        
    req.params = req.params || {};
    
    if( method === "get" ){
        req.params = querystring.parse( uri.query );
        next();
    }else{
        var form = new formidable.IncomingForm();
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
                next();
            })
        .parse(req);
    }
}
