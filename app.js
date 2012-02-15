var http = require("http"),
    url = require("url"),
    util = require("util"),
    
    webserver = require("./webserver"),
    httpserver = require("./httpserver"),
    chatserver = require("./server/chatserver");

// auto start mongodb server
var sys = require('sys')
var exec = require('child_process').exec;
var logger = require("log4js").getLogger(__filename);

exec("start_mongodb", function(error, stdout, stderr){
    sys.puts(stdout);
});

var app = http.createServer(function(req, res){
    var uri = url.parse(req.url),
        pathname = uri.pathname;
    console.log( pathname );
    if( httpserver.isStaticResource(pathname) ){
        return httpserver.serve(req, res);
    }
    webserver.serve(req, res);
}).listen(80);

process.on("uncaughtException", function(err){
    if( err.res ){
        err.res.end( {code: err.code || 500, msg: err.msg} );
    }
    logger.error( util.inspect(err) );
});
chatserver.setup( app );
