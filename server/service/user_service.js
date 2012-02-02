var log4js = require("log4js"),
    _ = require("underscore"),
    
    db = require("../resource/mongodb"),
    error = require("../error"),
    crypto_utils = require("../utils/crypto_utils");
    
module.exports = {

update_user_info: function( uid, params, next ){
    db.collection("user").findOne({_id: uid}, function(err, user){
        if( err ) throw err;
        if( !user ) throw new Error("Cannot find the user whose id is " + uid);
        db.collection("user").update({_id: uid}, {$set: params}, {safe: true}, function(err, user){
            if( err ) throw err;
            next && next();
        });
    });
},

checkPassword: function(passport, password, next, error){
    var _t = this;
    db.collection("user").findOne({passport: passport}, function(err, user){
        if( err ) throw err;
        if( !user ) throw new Error("不能找到通行证为" + passport + "的用户。");
        var digest = _t.cryptoPassword(passport, password, user.created_dt);
        if( user.password !== digest ) error( user );
        else next( user );
    });
},

cryptoPassword: function(passport, password, created_dt){
    return crypto_utils.hash_md5( passport + "_" + password + "_" + created_dt);
},

}
