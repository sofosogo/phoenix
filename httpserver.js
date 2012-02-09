var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    zlib = require("zlib"),
    
    mime = require("./httpserver/mime"),
    config = require("./httpserver/config");

function serve( req, res ){
	var pathname = url.parse( req.url ).pathname;
    
    if( !isStaticResource(pathname) ){
        res.writeHead(403, {"content-type": "text/plain"});
        res.write("Forbidden.");
        res.end();
        return;
    }
    
    pathname = path.normalize( pathname.replace(/\.\./g, "") ).slice(1);

    if( !pathname ) pathname = config.welcome;
    pathname = path.normalize( "./web/" + pathname );
    fs.stat(pathname, function(err, stat){
        if( err ){
            res.writeHead(404, {"content-type": "text/plain"});
            res.write("This request URL " + pathname + " was not found on this server.");
            res.end();
            return;
        }
        if( !stat.isFile() ){
            res.writeHead(403, {"content-type": "text/plain"});
            res.write("Forbidden.");
            res.end();
            return;
        }
        
        var ext = path.extname(pathname).toLowerCase().slice(1);
        var contentType = mime[ext] || "text/plain";
        res.setHeader("Content-Type", contentType);
                    
        var expires = config.expires;
        for( var i = 0, it; expires && i < expires.length; i++ ){
            it = expires[i];
            if( ext.match(it.regexp) ){
                res.setHeader("expires", new Date(new Date().getTime() + it.maxAge * 1000).toUTCString());
                res.setHeader("cache-control", "max-age=" + it.maxAge);
                break;
            }
        }
        
        var lastModified = stat.mtime.toUTCString(),
            ifModifiedSince = "if-modified-since";
        res.setHeader("last-modified", lastModified);
        if ( req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince] ){
            res.writeHead(304, "Not Modified");
            res.end();
        }else{
            var raw = fs.createReadStream(pathname);
            var acceptEncoding = req.headers["accept-encoding"] || "";
            var matched = ext.match(config.compress);
            if( matched && acceptEncoding.match(/\bgzip\b/) ){
                res.writeHead(200, "OK", {"content-encoding": "gzip"});
                raw.pipe(zlib.createGzip()).pipe(res);
            }else if( matched && acceptEncoding.match(/\bdeflate\b/)){
                raw.writeHead(200, "OK", {"content-encoding": "deflate"});
                raw.pipe(zlib.createDeflate()).pipe(res);
            }else{
                res.writeHead(200, "OK");
                raw.pipe(res);
            }
        }
    });
};

function isStaticResource( pathname ){
    return pathname.match( /^\/(scripts|html|css|images|audio|editor|upload)\/.+$/ )
        || pathname.match( /^\/[^/]*\.html$/ )
        || pathname === ""
        || pathname === "/"
        // || pathname === "/index.html"
        // || pathname === "/admin.html"
        || pathname === "/favicon.ico"
        || pathname === "/phoenix.ico";
}
exports.serve = serve;
exports.isStaticResource = isStaticResource;
