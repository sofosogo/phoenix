var error = require("../../error"),
    db = require("../mongodb"),
    user_service = require("../../service/user_service");

exports.post = function(req, res, params){
    if( !params.old ) return error.throw(res, 1, "旧密码不能为空。");
    if( !params.password ) return error.throw(res, 2, "新密码不能为空。");
    if( params.password !== params.repassword ) return error.throw(res, 4, "两次输入的新密码不一样。");
    
    user_service.checkPassword(params.passport, params.old, function(user){
        user.password = user_service.cryptoPassword(user.passport, params.password, user.created_dt);
        db.collection("user").save(user, function(err){
            if( err ) throw err;
            res.end( JSON.stringify({code: 0}) );
        });
    }, function(){
        return error.throw(res, 8, "旧密码输入有误。");
    });
}




