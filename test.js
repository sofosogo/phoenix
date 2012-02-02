var crypto = require("crypto");
var str = "hahahahha";
var hash_md5 = crypto.createHash("md5");
hash_md5.update( str );
console.log( hash_md5.digest("binary") );
