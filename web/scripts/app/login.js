define(function(require, exports, module) {

var component = require("component"),
    login = new component();
login.viewname = "login";
login.init = function($v){
    var temp = dit.create( $v[0], {
            nmsg: function( val, data ){
                if( data.code & 1 ) return "账号不能为空。";
                else if( data.code & 2 ) return "账号不存在。";
            },
            pmsg: function( val, data ){
                if( data.code & 4 ) return "密码不能为空。";
                else if( data.code & 8 ) return "密码不正确。";
            }
        }).fill(),
        $passport = $v.find("input[name=passport]").val(""),
        $password = $v.find("input[name=password]").val(""),
        $login = $v.find("input[name=login]"),
        data;
    function login(){
        var code = 0;
        data = temp.fetch();
        !data.passport && ( code += 1 );
        !data.password && ( code += 4 );
        if( !code ){
            require("ajax").put("/login", data, success);
            $login.button("loading");
        }
        handler( data, code );
    }
    function handler( data, code ){
        data.code = code;
        temp.fill( data );
        if( code & 3 ) $passport.focus();
        else if( code >> 2 ) $password.focus();
    }
    function success( res ){
        if( res.code === 0 ){
            require("msg").success("登录成功，现在进入首页……", 3);
            dh.require("user");
            require("main").hashchange("home");
        }else{
            handler( data, res.code );
        }
        $login.button("reset");
    }
    $password.keydown(function(e){
        if( e.keyCode === 13 ) login();
    });
    $login.click( login );
};

module.exports = login;
});