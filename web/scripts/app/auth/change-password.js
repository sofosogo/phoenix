define(function(require, exports, module) {

var component = new require("component"),
    chpwd = new component();
chpwd.viewname = "change-password";

chpwd.init = function( $v ){
    var passport = dh.get("user.passport"),
        temp = this.dit().fill( {passport: passport} );
    function change(){
        var data = temp.fetch();
        var code = 0;
        if( !data.old ) code += 1;
        if( !data.password ) code += 2;
        else if( data.password !== data.repassword ) code += 4;
        if( code !== 0 ) return handle_error( code );
        require("ajax").post("/user/password", data, function(resp){
            if( resp.code !== 0 ) return handle_error( resp.code );
            temp.clean();
            require("msg").success("密码已经修改。请使用新密码登录。")
        });
        console.log(data);
    }
    function handle_error( code ){
        var data = temp.fetch();
        data.code = code;
        if( code & 1 ) data.omsg = "旧密码不能为空。";
        if( code & 2 ) data.pmsg = "新密码不能为空。";
        if( code & 4 ) data.rmsg = "两次输入的新密码不一样。";
        if( code & 8 ) data.omsg = "旧密码输入有误。";
        temp.fill( data );
    }
    $v.find("input[name=save]").click(change);
    $v.find("input[name=renew]").keyup(function(e){
        if(e.keyCode === 13) change();
    });
};

module.exports = chpwd;

});