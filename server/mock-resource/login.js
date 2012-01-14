var users = require("./users").users;
exports.put = function(req, res, params, cookies){
    var code = 0,
        user,
        result = {},
        passport = params.passport,
        password = params.password;
    if( !passport ){
        code += 1;
    }else{
        if( !password ) code += 4;
        user = users.findByPassport(params.passport);
        if( !user ) code += 2;
        if( password && user && user.password !== password ) code += 8;
    }
    if( user ){
        result.user = user;
        cookies.set("sid", "111111", {httpOnly: false});
        cookies.set("uid", user.uid, {httpOnly: false});
    }
    result.code = code;
    res.end( JSON.stringify(result) );
}
