define(function(require, exports, module) {

var tabs = new require("tabs"),
    user = new tabs();
user.viewname = "user";

user.init = function(){
    user.addTab("user-list", "用户列表");
    user.addTab("user-add", "添加用户");
    user.addTab("user-edit", "修改用户");
    user.showTab("user-list");
};

module.exports = user;

});