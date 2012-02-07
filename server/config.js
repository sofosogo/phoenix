var path = require("path"),
    fs = require("fs"),
    
    fs_u = require("./utils/fs_utils"),
    config = require("./prod_config");

for( var i in config ){
    exports[i] = config[i];
}

exports.mapping = {
    "/user/{uid}": "/user/index",
    //"/role/{uid}": "/role/index",
    "/clothes/{id}": "/clothes/index",
};

exports.filters = [];
var default_filter_path = "./filter/";
["cookies", "login", "params", "render"].forEach(function(it){
    exports.filters.push( default_filter_path + it );
});

exports.default_password = "111111";

exports.hot_deploy = {
    "dirs": ["./server/"/* + exports.resource_folder*/],
    "exts": ["js"]
};
