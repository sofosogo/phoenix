define(function(require, exports, module) {

var tabs = new require("tabs"),
    clothes = new tabs();
clothes.viewname = "clothes";

clothes.init = function(){
    clothes.addTab("clothes-list", "旗袍列表");
    clothes.addTab("clothes-add", "添加旗袍");
    clothes.addTab("clothes-edit", "修改旗袍");
    clothes.showTab("clothes-list");
};

module.exports = clothes;

});