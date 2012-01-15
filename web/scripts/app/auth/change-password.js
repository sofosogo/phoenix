define(function(require, exports, module) {

var component = new require("component"),
    chpwd = new component();
chpwd.viewname = "change-password";

chpwd.init = function( $v ){
    var passport = dh.get("user.passport"),
        temp = this.dit().fill( {passport: passport} );
    function change(){
        var data = temp.fetch();
        console.log(data);
    }
    $v.find("input[name=save]").click(change);
    $v.find("input[name=renew]").keyup(function(e){
        if(e.keyCode === 13) change();
    });;
};

module.exports = chpwd;

});