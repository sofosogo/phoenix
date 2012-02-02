define(function(require, exports, module){

var msg = require("msg");
 
module.exports = upload;

function upload( opt ){
    var _t = this,
        $v = this.view = opt.view || $(default_html),
        $file = $v.find(".files-upload"),
        $drop = $v.find(".drop-area"),
        $preview = this.$preview = $v.find(".file-list");
        
    this.opt = opt || {};
    this.onchange = opt.onchange || function(){};
    
    $file.change(function(){
        _t.traverseFiles(this.files);
    });
    
    $drop.bind("dragenter", function(evt){
        $drop.addClass("drop-over");
        evt.preventDefault();
        evt.stopPropagation();
    });
    $drop.bind("dragover", function(evt){
        evt.preventDefault();
        evt.stopPropagation();
    });
    $drop.bind("dragleave", function(evt){
        $drop.removeClass("drop-over");
        evt.preventDefault();
        evt.stopPropagation();
    });
    $drop.bind("drop", function(evt){
        _t.traverseFiles( evt.originalEvent.dataTransfer.files );
        $drop.removeClass("drop-over");
        evt.preventDefault();
        evt.stopPropagation();
    });
    $preview.delegate("li", "mouseover", function(e){
        $(this).children("div").show();
    }).delegate("li", "mouseout", function(e){
        $(this).children("div").hide();
    }).delegate("div", "click", function(e){
        var $btn = $(this);
        var $img = $btn.prev();
        if( $btn.text() === "x" ){
            $btn.text("+");
            $img.addClass("opacity");
        }else{
            $btn.text("x");
            $img.removeClass("opacity");
        }
        _t.onchange();
    });
}
var proto = upload.prototype = {};
proto.traverseFiles = function( files ){
    if (typeof files !== "undefined") {
        for (var i=0, l=files.length; i<l; i++) {
            this.uploadFile( files[i] );
        }
    }else {
        fileList.innerHTML = "No support for the File API in this web browser";
    }   
}

proto.uploadFile = function( file ){
    var _t = this;
    var name = file.name
    var name_pattern = this.opt.name_pattern;
    if( name_pattern && !name.match(name_pattern) )
        return msg.error( this.opt.name_pattern_msg || name + "文件名不符合要求。" );
    
    var type = file.type
    var type_pattern = this.opt.type_pattern;
    if( type_pattern && !type.match(type_pattern) )
        return msg.error( this.opt.type_pattern_msg || name + "文件类型不符合要求。");
    
    xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", function (evt) {
        if( evt.lengthComputable ){
            var percent = (evt.loaded / evt.total) * 100 + "%";
            console.log(name + " " + percent + " uploaded.");
            //progressBar.style.width = (evt.loaded / evt.total) * 100 + "%";
        }
    }, false);
    xhr.addEventListener("load", function(){
        console.log(name + " uploaded.");
        console.log(xhr.responseText)
        var result = JSON.parse( xhr.responseText );
        if( result.code === 0 ){
            var isImg = /image\//.test(type);
            var path = isImg ? result.path : ("/images/mime/" + type + ".png");
            _t.showFile( path );
            _t.onchange();
            //progressBarContainer.className += " uploaded";
            //progressBar.innerHTML = "Uploaded!";
        }else{
            msg.error( result.reason || "上传文件出错。");
        }
    }, false);
    xhr.open("post", "/upload?_=" + new Date().getTime(), true);
    xhr.setRequestHeader("x-file-name", file.name);
    xhr.send( file );
}

proto.showFiles = function( arr ){
    var _t = this;
    if( !arr || arr.length === 0 ) return ;
    $.map(arr, function(el){
        _t.showFile( el );
    });
}
proto.showFile = function( path ){
    $("<li>").append($("<img>", {src: path, width: "60px", height: "100px"}))
        .append( $("<div>", {text: "x", "class": "delete"}) )
        .appendTo( this.$preview );
}
proto.getFiles = function(){
    return $.map(this.$preview.find("img:not(.opacity)"), function(el){
        return el.getAttribute("src");
    });
}

var default_html = 
'<div>' +
'   <p>' +
'       <input class="files-upload" type="file">' +
'   </p>' +
'   <p class="drop-area">' +
'       <span class="drop-instructions">或者将文件拖入此处。</span>' +
'   </p>' +
'   <ul class="file-list">' +
//'       <li>' + 
//'           <img src="{{src}}" width="30" height="50">' +
//'           <span>-<span>' +
//'       </li>' +
'   </ul>' +
'</div>';

});