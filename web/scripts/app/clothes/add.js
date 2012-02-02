define(function(require, exports, module) {

var component = require("component"),
    add = new component();
add.viewname = "clothes-add";
add.init = function( $v ){
    var temp = this.dit(),
        $save = $v.find("input[name=save]");
    $save.click(function(){
        $save.button("loading");
        require("ajax").put("/clothes/", temp.fetch(), function(result){
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