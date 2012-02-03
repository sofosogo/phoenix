define(function(require, exports, module) {

var component = require("component"),
    ajaxupload = require("ajax-upload"), 
    edit = new component();
edit.viewname = "clothes-edit";
edit.init = function( $v ){
    var _t = this,
        temp = this.dit(),
        $save = $v.find("input[name=save]"),
        $delete = $v.find("input[name=delete]");
    $save.click(function(){
        $save.button("loading");
        var data = temp.fetch();
        data.imgs = _t.upload.getFiles();console.log(data);
        require("ajax").post("/clothes/" + data.id, data, function(result){
            $save.button("reset");
            if(result.code ===0){
                require("msg").success("保存成功");
            }
        })
    });
    $delete.click(function(){
        var data = temp.fetch();
        if( !confirm("你确定要删除 " + data.name + " 吗？") ) return;
        require("ajax").del("/clothes/" + data.id, data, function(result){
            $save.button("reset");
            if(result.code === 0){
                temp.clean();
                require("msg").success("删除成功");
            }
        })
    });
    
    this.upload = new ajaxupload({
        onchange: function( path ){
            $save.click();
        }
    });
    $v.find(".upload-clothes").append( this.upload.view )
}
edit.setId = function( id ){
    this.cid = id;
}
edit.onShow = function(){
    if( !this.cid ) return;
    var _t = this;
    require("ajax").get("/clothes/" + this.cid, function( clothes ){
        _t.dit().fill(clothes);
        _t.upload.showFiles( clothes.imgs );
    });
}
module.exports = edit;

});