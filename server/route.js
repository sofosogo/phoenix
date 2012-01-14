var path = require("path"),
    fs = require("fs"),
    
    fs_u = require("./utils/fs_utils.js"),
    config = require("./config");

var str_map = {},
    regex_map = [],
    path_map = {};
    
function classify(path, realPath, module){
    if( path.indexOf("{") == -1 ){
        str_map[path] = module;
    }else{
        var params = [];
        t = path.replace("/", "\\/");
        t = t.replace(/(\{([\w\d]+)\})/, function(match, str, key ){
            params.push( key );
            return "([\\w\\d%]+)";
        });
        regex_map.push({
            regex: new RegExp("^" + t + "$", "ig"),
            params: params,
            module: module
        });
    }
    if( !module["delete"] ){
        module["delete"] = module.del;
    }
        
    path_map[path] = realPath;
}

(function pre_handle(){
    var module, path, url,
        root = "./server/" + config.resource_folder,
        require_pre = "./" + config.resource_folder,
        auto_map = fs_u.getAllFileNames(root),
        cust_map = config.mapping;

    auto_map.forEach(function(it, i){
        path = it.replace(root, "").replace(".js", "");
        module = require( require_pre + path );
        url = module.path || path;
        classify( url, path, module );
    });
    for( url in cust_map ){
        path = cust_map[url];
        module = require( require_pre + path );
        classify( url, path, module );
    }
    
    console.log("Resource Mapping: ");
    for( path in path_map){
        console.log( path + " = " + path_map[path] );
    }
})();

exports.route = function(req, res, pathname ){
    if( str_map[pathname] ) return str_map[pathname];
    var i = 0, obj, 
        len = regex_map.length;
    for( ; i < len; i++ ){
        obj = regex_map[i];
        if( pathname.match(obj.regex) ){
            for( var j = 0; j < obj.params.length; j++ ){
                req.params[ obj.params[j] ] = RegExp["$"+(j+1)];
            }
            return obj.module;
        }
    }
}


