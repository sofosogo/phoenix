define(function(require, exports, module) {

var component = require("component"),
    add = new component();
add.viewname = "user-add";
add.init = function( $v ){
    var temp = this.dit(),
        $save = $v.find("input[name=save]");
    $save.click(function(){
        $save.button("loading");
        require("ajax").put("/user/", temp.fetch(), function(result){
            $save.button("reset");
            if(result.code ===0){
                require("msg").success("保存成功");
                temp.clean();
            }
        })
    });
}
module.exports = add;

});