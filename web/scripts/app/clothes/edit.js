define(function(require, exports, module) {

var component = require("component"),
    ajaxupload = require("ajax-upload"), 
    edit = new component();
edit.viewname = "clothes-edit";
edit.init = function( $v ){
    var _t = this,
        temp = this.dit(),
        $summary = $v.find("textarea[name=summary]"),
        $desc = $v.find("textarea[name=desc]"),
        $save = $v.find("input[name=save]"),
        $delete = $v.find("input[name=delete]");
    $save.click(function(){
        $save.button("loading");
        _t.descEditor.sync();
        _t.summaryEditor.sync();
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
    $v.find(".upload-clothes").append( this.upload.view );
    
    this.summaryEditor = KindEditor.create($summary[0], {
        width: "778px",
        allowUpload: false,
        items: [
            'fontname', 'fontsize', '|', 'textcolor', 'bgcolor', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
            'insertunorderedlist', '|', 'source']
    });
    this.descEditor = KindEditor.create($desc[0], {
        width: "778px",
        allowFileManager : true,
        uploadJson : "/kindeditor/upload",
        fileManagerJson: "/kindeditor/manager"
    });
}
edit.setId = function( id ){
    this.cid = id;
}
edit.onShow = function(){
    if( !this.cid ) return;
    var _t = this;
    require("ajax").get("/clothes/" + this.cid, function( clothes ){
        _t.dit().fill(clothes);
        _t.descEditor.html( clothes.desc || "" );
        _t.summaryEditor.html( clothes.summary || "" );
        _t.upload.showFiles( clothes.imgs );
    });
}
module.exports = edit;

});