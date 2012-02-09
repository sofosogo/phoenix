var path = require("path"),
    fs = require("fs"),
    util = require("util"),
    
    uuid = require("../../utils/uuid");
    
var logger = require("log4js").getLogger(__filename);

var upload_path = "/upload/";

exports.post = function(req, res, params){
    res.setHeader("Content-Type", "text/html; charset=UTF-8")
    var result = {};
    var dir = (params.dir || "editor").replace("/", "").replace("\\", "");
    var file = params.imgFile;
    var new_path = path.join( upload_path, dir, uuid()+path.extname(file.name) );
    
    fs.rename(file.path, path.resolve(path.join("./web", new_path)), function(err){
        if( err ){
            logger.error( util.inspect(err) );
            return res.render( {error: 1} );
        }
        res.render( {error: 0, url: new_path.replace(/\\/g, "/")} );
    });
}
