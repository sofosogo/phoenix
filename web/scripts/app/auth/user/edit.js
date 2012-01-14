define(function(require, exports, module) {

var component = require("component"),
    edit = new component();
edit.viewname = "user-edit";
edit.init = function( $v ){
    var temp = this.dit(),
        $save = $v.find("input[name=save]"),
        $delete = $v.find("input[name=delete]");
    $save.click(function(){
        $save.button("loading");
        var data = temp.fetch();
        require("ajax").post("/user/" + data.uid, data, function(result){
            $save.button("reset");
            if(result.code ===0){
                require("msg").success("保存成功");
            }
        })
    });
    $delete.click(function(){
        var data = temp.fetch();
        require("ajax").del("/user/" + data.uid, data, function(result){
            $save.button("reset");
            if(result.code === 0){
                temp.clean();
                require("msg").success("删除成功");
            }
        })
    });
}
edit.showUser = function( passport ){
    var _t = this;
    require("ajax").get("/user/" + passport, function( user ){
        _t.dit().fill(user);
    });
}
module.exports = edit;

});