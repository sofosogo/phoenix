define(function(require, exports, module) {

var component = require("component"),
    home = new component();
home.viewname = "home";
home.init = function($v) {
    var temp = dit.create( $v[0], {
        last_login_date: function(val, data){
            return val ? new Date(val).format("yyyy-MM-dd hh:mm:ss") : null;
        },
        has_last_login_date: function(val, data){
            return data.last_login_date ? "display" : "none";
        },
    });
    require("ajax").get("/user/home", function(rep){
        temp.fill( rep )
    });
};

module.exports = home;

});
