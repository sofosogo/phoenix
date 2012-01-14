var path = require("path"),
    fs = require("fs"),
    
    fs_u = require("./utils/fs_utils.js");

/*
 * dev env: mock-resource
 * prod env: resource
 */
exports.resource_folder = "mock-resource"; 

exports.mapping = {
    "/user/{uid}": "/user/index",
    //"/role/{uid}": "/role/index"
};

exports.filters = [];
var default_filter_path = "./filter/";
["cookies", "login", "params"].forEach(function(it){
    exports.filters.push( default_filter_path + it );
});
