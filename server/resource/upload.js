var path = require("path"),
    fs = require("fs"),
    
    uuid = require("../utils/uuid");
    
var upload_path = "/images/upload/";

exports.post = function(req, res, params){
    var extname = path.extname( req.headers["x-file-name"] );
    var filepath = upload_path + uuid() +  extname;
    var ws = fs.createWriteStream("./web" + filepath);
    req.on("data", function(data){
        ws.write( data );
    }).on("end", function(){
        ws.end();
        res.end( JSON.stringify({code: 0, path: filepath}) );
    });
}
