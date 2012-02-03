var db = require("./mongodb"),

    uuid = require("../utils/uuid"),
    
    user_service = require("../service/user_service");
    
exports.put = function(req, res, params, cookies){
    var code = 0,
        user,
        result = {},
        passport = params.passport,
        password = params.password;
    function fn(){
        result.code = code;
        res.end( JSON.stringify(result) );
    }
    if( !passport || !password ){
        !passport && (code += 1);
        !password && (code += 4);
        return fn();
    }
    db.collection("user").findOne( {"passport": passport}, function(err, user){
        if( !user )
            code += 2;
        else if( user.password !== user_service.cryptoPassword(passport, password, user.created_dt) )
            code += 8;
        else{
            result.user = user;
            var sid = uuid();
            db.collection("session").insert({
                _id: sid,
                id: sid,
                uid: user.uid
            });
            cookies.set("sid", sid, {httpOnly: false});
            cookies.set("uid", user.uid, {httpOnly: false});
        }
        fn();
    });
    
}