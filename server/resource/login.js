var db = require("./mongodb");
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
        if( !user ) code += 2;
        else if( user.password !== password ) code += 8;
        else{
            result.user = user;
            cookies.set("sid", "111111", {httpOnly: false});
            cookies.set("uid", user.uid, {httpOnly: false});
        }
        fn();
    });
    
}