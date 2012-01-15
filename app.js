var http = require("http"),
    url = require("url"),
    
    webserver = require("./webserver"),
    httpserver = require("./httpserver");

// auto start mongodb server
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
exec("start_mongodb", puts);

http.createServer(function(req, res){
    var uri = url.parse(req.url),
        pathname = uri.pathname;
    console.log( pathname );
    if( httpserver.isStaticResource(pathname) ){
        return httpserver.serve(req, res);
    }
    webserver.serve(req, res);
}).listen(80);

