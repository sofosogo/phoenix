var path = require("path"),
    fs = require("fs"),
    util = require("util");
var fs_utils = require("../../utils/fs_utils"),
    datetime = require("../../utils/datetime");
    
var logger = require("log4js").getLogger(__filename);

var upload_path = "/upload/";
var regex_photo = /\.(png|jpg|gif|bmp)$/;

exports.get = function(req, res, params){
    params.path = (params.path || "").replace(/\.\./g, "");
    var current_dir_path = path.join(upload_path, params.dir, params.path);
    var resolved_path = path.resolve( path.join("./web", current_dir_path) );
    var files = fs.readdirSync( resolved_path );
    files = files.map(function(it){
        var stat = fs.statSync( path.join(resolved_path, it) );
        var json;
        if( stat.isDirectory() ){
            json = {
                is_dir: true,
                has_file: true,
                filesize: 0,
                is_photo: false,
                filetype: ""
            };
        }else if( stat.isFile() ){
            json = {
                "is_dir": false,
                "has_file": false,
                "filesize": stat.size,
                "is_photo": !!it.match(regex_photo),
                "filetype": path.extname(it),
            }
        }else{
            json = {};
        }
        json.filename = it;
        json.datetime = datetime.format(stat.ctime, "yyyy-MM-dd hh:mm:ss" );
        console.log( util.inspect(json))
        return json;
    });
    console.log( util.inspect(files))
    var order = params.order;
    if( order ){
        order = order.toLowerCase();
        if( order === "type" ){
            files.sort(function(f1, f2){
                return f1.filetype > f2.filetype;
            });
        }else if( order === "size" ){
            files.sort(function(f1, f2){
                return f1.filesize > f2.filesize;
            });
        }else{
            files.sort(function(f1, f2){
                return f1.name > f2.name;
            });
        }
    }
    var json = {
        moveup_dir_path: path.dirname( params.path ),
        current_dir_path: path.dirname( params.path ),
        current_url: current_dir_path.replace(/\\/g, "/") + "/",
        total_count: files.length,
        file_list: files
    };
    logger.info( util.inspect(json) );
    res.render( json );
}
