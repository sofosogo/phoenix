define(function(require, exports, module) {

var tabs = new require("tabs"),
    clothes = new tabs();
clothes.viewname = "profile";

clothes.init = function(){
    clothes.addTab("change-password", "修改密码");
    clothes.addTab("update-profile", "修改个人信息");
    clothes.showTab("change-password");
};

module.exports = clothes;

});