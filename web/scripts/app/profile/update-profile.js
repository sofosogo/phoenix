define(function(require, exports, module) {

var component = new require("component"),
    update = new component();
update.viewname = "update-profile";

update.init = function( $v ){
    var user = dh.get("user"),
        temp = this.dit().fill( user ),
        $save = $v.find("input[name=save]");
    function change(){
        var data = temp.fetch();
        $save.button("loading");
        require("ajax").post( "/profile/" + data.uid, data, function(result){
            $save.button("reset");
            if( result.code === 0 ){
                require("msg").success("个人信息已更新。");
            }
        });
    }
    $save.click( change );
};

module.exports = update;

});