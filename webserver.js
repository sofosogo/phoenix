var http = require("http"),
    url = require("url"),
    querystring = require("querystring"),
    path = require("path"),
    fs = require("fs"),
    
    formidable = require('formidable'),
    Cookies = require("cookies"),
    
    config = require("./server/config"),
    filter = require("./server/filter"),
    route = require("./server/route"),
    error = require("./server/error");

exports.serve = function(req, res){
    try{
        filter.filter(req, res, handle);
    }catch( e ){
        console.log(e);
        res.statusCode = parseInt(e.message);
        res.end();
    }finally{
        
    }
}

function handle(req, res){
    var uri = url.parse( req.url ),
        pathname = uri.pathname,
        method = req.method.toLowerCase(),
        resource = route.route(req, res, pathname);
    if( !resource ) return error.throw(res, 404);
    if( !resource[method] ) return error.throw(res, 405);
    
    res.statusCode = 200;
    res.setHeader("content-type", "text/json");
    resource[method](req, res, req.params, req.cookies);
}
