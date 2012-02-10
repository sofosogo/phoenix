define(function(require, exports, module) {

var component = require("component"),
    add = new component();
add.viewname = "user-add";
add.init = function( $v ){
    var temp = this.dit(),
        $save = $v.find("input[name=save]"),
        $reset = $v.find("input[name=reset]");
    $save.click(function(){
        var u = temp.fetch();
        if( !u.passport || !u.name ) return;
        $save.button("loading");
        require("ajax").put("/user/", u, function(result){
            $save.button("reset");
            if(result.code ===0){
                require("msg").success("保存成功");
                temp.clean();
            }
        })
    });
    $reset.click(function(){
        temp.clean();
    });
}
module.exports = add;

});