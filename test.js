// var crypto = require("crypto");
// var str = "hahahahha";
// var hash_md5 = crypto.createHash("md5");
// hash_md5.update( str );
// console.log( hash_md5.digest("binary") );

var gm = require("gm"),
    path = require("path"),
    fs = require("fs"),
    util = require("util"),
    fs_u = require("./server/utils/fs_utils.js");
    
var root = path.resolve("./web/images/upload/"),
    files = fs_u.getAllFileNames(root),
    sizes = [[30, 50]];

//emitter.setMaxListeners(0);

// files.forEach(function(f, i){
    // if( f.indexOf(".png") === -1 ) return;
    // var new_path = f.replace(".png", "_" + 30 + "x" + 50 + ".png");
    // gm(f).resize(30, 50).noProfile().write(new_path, function (err) {
        // if (!err) console.log('done');
    // });
    // // sizes.forEach(function(s){
        // // var new_path = f.replace(".png", "_" + s[0] + "x" + s[1] + ".png");
        // // var old_file = fs.createReadStream(f);
        // // var new_file = fs.createWriteStream(new_path);
        // // new_file.once("open", function(fd){
            // // util.pump(old_file, new_file, function(){
                // // console.log(new_path)
                // // gm(new_path).resize(s[0], s[1]);
            // // });
        // // });
    // // })
// });

fs.rename("./web/images/upload/temp/8b80c78c900b5dd41c167de79f96a1db", "./web/images/upload/image/8b80c78c900b5dd41c167de79f96a1db", function(err, st){
    if( err ) throw err;
    console.log(st);
})
