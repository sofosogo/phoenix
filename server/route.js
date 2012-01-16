var path = require("path"),
    fs = require("fs"),
    
    fs_u = require("./utils/fs_utils.js"),
    config = require("./config");

var str_map = {},
    regex_map = [],
    url_map = {};

function classify(url, res_abs_path){
    if( url.indexOf("{") == -1 ){
        str_map[url] = res_abs_path;
    }else{
        var params = [];
        t = url.replace("/", "\\/");
        t = t.replace(/(\{([\w\d]+)\})/, function(match, str, key ){
            params.push( key );
            return "([\\w\\d%]*)";
        });
        regex_map.push({
            regex: new RegExp("^" + t + "$", "ig"),
            params: params,
            path: res_abs_path
        });
    }
    var md = require(res_abs_path);
    if( !md["delete"] && md.del ){
        md["delete"] = md.del;
    }
    url_map[url] = res_abs_path.replace(root, "").replace(".js", "");
}

var root = path.resolve("./server/" + config.resource_folder);

function load_resource( path ){
    var md = require( path );
    var url = md.path;
    if( !url ){
        url = path.replace(root, "").replace(".js", "");
    }
    classify( url, path );
}

(function pre_handle(){
    var _url, _path,
        auto_map = fs_u.getAllFileNames(root),
        cust_map = config.mapping;

    auto_map.forEach( load_resource );
    
    for( _url in cust_map ){
        _path = path.resolve(root + cust_map[_url]);
        classify( _url, _path );
    }
    
    console.log("Resource Mapping: ");
    for( _url in url_map){
        console.log( _url + " = " + url_map[_url] );
    }
})();

exports.route = function(req, res, pathname ){
    if( str_map[pathname] ) return require(str_map[pathname]);
    var i = 0, obj, 
        len = regex_map.length;
    for( ; i < len; i++ ){
        obj = regex_map[i];
        if( pathname.match(obj.regex) ){
            for( var j = 0; j < obj.params.length; j++ ){
                req.params[ obj.params[j] ] = RegExp["$"+(j+1)];
            }console.log("aaa"+obj.path)
            return require(obj.path);
        }
    }
}
exports.load_resource = load_resource;


