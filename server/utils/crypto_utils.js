var crypto = require("crypto"),
    log4js = require("log4js");
    
var log = log4js.getLogger(__filename);

module.exports = {

hash_md5: function( str ){
    var hash_md5 = crypto.createHash("md5");
    hash_md5.update( str );
    var digest = hash_md5.digest( "hex" );
    log.info("Digest Before: " + str + ", After: " + digest);
    return digest;
}

}
