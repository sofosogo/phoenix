var path = require("path"),
    fs = require("fs"),
    
    fs_u = require("./utils/fs_utils"),
    config = require("./prod_config");

for( var i in config ){
    exports[i] = config[i];
}

exports.mapping = {
    "/user/{uid}": "/user/index",
    //"/role/{uid}": "/role/index"
};

exports.filters = [];
var default_filter_path = "./filter/";
["cookies", "login", "params"].forEach(function(it){
    exports.filters.push( default_filter_path + it );
});

exports.default_password = "111111";
