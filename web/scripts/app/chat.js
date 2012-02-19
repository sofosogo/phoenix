define(function(require, exports, module){

var component = require("component"),
    chat = new component(),
    $chat = chat.$view = $("#chat"),
    $big = $chat.find(".ct-big"),
    $small = $chat.find(".ct-small"),
    $title = $chat.find(".ct-title"),
    $msglist= $chat.find(".ct-msglt"),
    $contactlist = $chat.find(".ct-contact"),
    $input = $(".ct-msg"),
    $send = $(".ct-send"),
    $minus = $chat.find(".icon-minus"),
    $plus = $chat.find(".icon-plus");
var chat = exports;
chat.info = info;

var socket, users, passport;

function info( msg ){
    if( typeof msg === "string" ){
        msg = {msg: "[系统] " + msg, type: "system"};
    }
    var from = msg.from === passport ? 
        "我" : "<span p='" + msg.from + "'>" + msg.fromname + "</span>";
    if( msg.to === "all" ){
        msg.msg = "[群聊] " + from + "说：" + msg.msg;
        msg.type = "world";
    }else if( msg.to ){
        var to = msg.to === passport ? 
            "我" : "<span p='" + msg.to + "'>" + msg.toname + "</span>";
        msg.msg = "[个人] " + from + "对" + to + "说： " + msg.msg;
        msg.type = "p2p";
    }
    var $li = $("<li>", {"class": msg.type}).html( msg.msg );
    $li.appendTo( $msglist );
    
    $msglist[0].scrollTop = $msglist[0].scrollHeight;
}

dh.listen("user", function(data){
    var user = data.data;
    passport = user ? user.passport : null;
    if( !passport ){
        console.log("logout socket ...")
        return socket.emit("logout");
    }
    if( socket ) return socket.socket.reconnect();
    socket = io.connect("/chat");
    socket.on("connect", function( data ){
        socket.emit("user-list");
        $msglist.empty();
        $input.empty();
        $chat.show();
        info("你已经成功登录聊天服务器。");
    });
    socket.on("connect_failed", function( data ){
        console.log("connect_failed--------------------");
        console.log(data);
    });
    socket.on("user-list", function( us ){
        users = us;
        $contactlist.hide().empty();
        $("<option>", {value: "all", text: "所有人"})
            .appendTo( $contactlist );
        for( var p in us ){
            if( p === passport ) continue;
            $("<option>", {value: p, text: us[p]})
                .appendTo( $contactlist );
        }
        $contactlist.show();
    });
    socket.on("msg", info);
    socket.on("user-login", function( u ){
        if( !users || users[u.passport] ){
            // 及时更新name属性。
            users[u.passport] = u.name;
            return;
        }
        users[u.passport] = u.name;
        $("<option>", {value: u.passport, text: u.name})
            .appendTo( $contactlist );
        info( u.name + " 登录了。" );
    });
    socket.on("user-offline", function( u ){
        info( u.name + " 已离线，不能发消息给TA。" );
    });
    socket.on("user-logout", function( u ){
        var pt = u.passport;
        if( !users || !users[pt] ) return;
        delete users[pt];
        $contactlist.find("option[value=" + pt + "]").remove();
        info( u.name + " 退出了。" );
    });
    socket.on("disconnect", function(){
        $chat.hide();
    });
});

function send(){
    var to = $contactlist.val();
    var toname = users[to];
    var msg = $input.val();
    if( !msg ) return info("不能发送空信息。");
    msg = {to: to, msg: msg};
    
    socket.emit("msg", msg );
    $input.val( "" );
}
$input.keyup(function(e){
    if( e.keyCode === 13 ){
        return send();
    }
});
$send.click( send );
$msglist.delegate("li.world", "click", function(){
    $contactlist.val( "all" );
});
$msglist.delegate("span", "click", function(e){
    var p = this.getAttribute("p");
    if( !users[p] ) return info( this.innerHTML + " 已离线，不能发消息给TA。");
    $contactlist.val( p );
    $input.focus();
    e.stopPropagation();
});
$contactlist.change(function(){
    $input.focus();
});
$minus.click(function(){
    $big.hide();
    $small.show();
});
$plus.click(function(){
    $big.show();
    $small.hide();
});
$title.draggable({
    start: function(x, y, e){
        this.drag = {};
        this.drag.height = $msglist.height();
    },
    move: function(x, y, e, dx, dy, dt){console.log(window)
        var height = this.drag.height - dy;
        if( height <= window.height() - 115 ){
            $msglist.height( this.drag.height - dy );
        }
        return false;
    },
    end: function(x, y, e, dx, dy){
        var height = this.drag.height - dy;
        if( height <= window.height() - 115 ){
            $msglist.height( this.drag.height - dy );
        }
        $msglist[0].scrollTop = $msglist[0].scrollHeight;
        return false;
    }
});
});