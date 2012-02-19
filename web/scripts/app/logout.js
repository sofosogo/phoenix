define(function(require, exports, module) {

var component = require("component"),
    logout = new component();
logout.viewname = "logout";

logout.init = function(){}

logout.onShow = function(){
    require("ajax").put("/logout", {"_": 0}, function(){
        dh.get("user").del();
    });
}

module.exports = logout;

});