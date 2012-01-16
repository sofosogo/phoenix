var fs = require('fs'),
    util = require("util"),
    spawn = require("child_process").spawn,
    path = require("path"),
    
    fs_u = require("./utils/fs_utils.js"),
    config = require("./config");

var json = config.hot_deploy,
    files = [],
    dirs = json.dirs || [],
    exts = (json.exts || []).join("|"),
    regexp = new RegExp("^.*\.(" + exts + ")$", "ig");

dirs.forEach(function(dir){
    files = files.concat( fs_u.getAllFileNames(dir) );
});
files.forEach(function(file){
    if( regexp && !file.match(regexp) ) return;
    fs.watch(file, {
        persistent: true,
        interval: 500
    }, function(){
        var abs_path = path.resolve(file);
        console.log(abs_path);
        console.log( abs_path in require.cache)
        delete require.cache[abs_path];
    });
});


