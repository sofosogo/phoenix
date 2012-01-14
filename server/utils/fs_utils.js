var fs = require("fs");

function getAllFileNames( root ){
    var array = [],
        files = fs.readdirSync( root ),
        f, stat;
    files.forEach(function(it){
        f = root + "/" + it;
        stat = fs.statSync(f);
        if( stat.isDirectory() ){
            array = array.concat( getAllFileNames(f) )
        }else if( stat.isFile() ){
            array.push( f );
        }
    });
    return array;
}
exports.getAllFileNames = getAllFileNames;
