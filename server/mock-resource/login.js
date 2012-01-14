var users = require("./users").users;
exports.put = function(req, res, params, cookies){
    var code = 0
        user = {};
    if( params.passport === "1" ){
        code += 1;
    }else if( params.passport === "2" ){
        code += 2;
    }else if( params.passport === "3" ){
        code += 4;
    }else if( params.passport === "4" ){
        code += 8;
    }else{
        user = users[0];
        cookies.set("sid", "111111", {httpOnly: false});
        cookies.set("uid", user.uid, {httpOnly: false});
    }
    res.end( JSON.stringify( {code: code, user: user} ) );
}
