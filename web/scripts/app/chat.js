define(function(require, exports, module){

var component = require("component"),
    chat = new component(),
    $chat = chat.$view = $("#chat"),
    $msglist= $chat.find(".ct-msglt"),
    $contactlist = $chat.find(".ct-contact"),
    $input = $(".ct-msg"),
    $send = $(".ct-send");
var chat = exports;

chat.info = function(){
    
}

function info( msg ){
    if( typeof msg === "string" ){
        msg = {msg: msg, type: "S"};
    }
    var $li = $("<li>", {text: msg.msg});
    $li.appendTo( $msglist );
}

var socket, users;
dh.listen("user", function(){
    socket = io.connect('http://localhost');
    socket.on("connect", function( data ){
        var user = dh.get("user");
        socket.emit( "sid", getCookie("sid") );
        $chat.show();
    });
    socket.on("login", function( users ){
        console.log( users );
        info( "你已经成功登录聊天服务器。" );
        users = users;
        $contactlist.hide().empty();
        $("<option>", {value: "all", text: "所有人"})
            .appendTo( $contactlist );
        for( var p in users ){
            $("<option>", {value: p, text: users[p]})
                .appendTo( $contactlist );
        }
        $contactlist.show();
    });
    socket.on("msg", function( msg ){
        info( msg.msg );
    });
    socket.on("user-added", function( u ){
        if( !users || users[u.passport] ) return;
        users[u.passport] = u.name;
        $("<option>", {value: u.passport, text: u.name})
            .appendTo( $contactlist );
        info( u.name + " 登录了。" );
    });
    socket.on("user-removed", function( u ){
        var pt = u.passport;
        if( !users || !users[pt] ) return;
        delete users[pt];
        $contactlist.find("option[value=" + pt + "]").remove();
        info( u.name + " 退出了。" );
    });
    socket.on("disconnect", function( users ){
        $chat.hide();
    });
});
dh.listen("logout", function(){
    socket.emit("disconnect");
    $chat.hide();
});

function send(){
    var to = $contactlist.val();
    var msg = $input.val();
    if( !msg ) info("不能发送空信息。");
    msg = {to: to, msg: msg};
    console.log( msg );
    
    socket.emit("msg", {to: to, msg: msg} );
    $input.val( "" );
}
$input.keyup(function(e){
    if( e.keyCode === 13 ){
        return send();
    }
});
$send.click( send );

});