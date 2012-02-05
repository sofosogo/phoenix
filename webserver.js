var http = require("http"),
    url = require("url"),
    querystring = require("querystring"),
    path = require("path"),
    fs = require("fs"),
    util = require("util"),
    
    formidable = require('formidable'),
    Cookies = require("cookies"),
    
    config = require("./server/config"),
    filter = require("./server/filter"),
    route = require("./server/route"),
    error = require("./server/error"),
    hot_deploy = require("./server/hot_deploy");

exports.serve = function(req, res){
    try{
        filter.filter(req, res, validate);
    }catch( e ){
        console.log( util.inspect(e) );
        res.statusCode = 200;
        res.end( JSON.stringify({code: e.code, msg: e.msg}) );
    }
}

function validate(req, res){
    var uri = url.parse( req.url ),
        pathname = uri.pathname,
        method = req.method.toLowerCase(),
        resource = route.route(req, res, pathname);
    if( !resource ) return error.throw(res, 404);
    if( !resource[method] ) return error.throw(res, 405);
    
    var validate = resource[method].validate;
    if( !validate || validate.length === 0 ){
        return handle(req, res, resource, method);
    }
    var i = 0
        len = validate.length, 
        callback = function(){
            if( i === len - 1 ){
                handle(req, res, resource, method);
            }else{
                validate[++i]( req, res, callback, req.params, req.cookies );
            }
        };
    validate[i]( req, res, callback, req.params, req.cookies );
}

function handle(req, res, resource, method){
    res.statusCode = 200;
    res.setHeader("content-type", "text/json");
    resource[method](req, res, req.params, req.cookies);
}
