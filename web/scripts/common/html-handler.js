define(function(require, exports, module) {

var map = {
    "login": "/html/login.html",
    "logout": "/html/logout.html",
    "home": "/html/home.html",
    
    "user": "/html/auth/user.html",
    "user-list": "/html/auth/user/list.html",
    "user-add": "/html/auth/user/add.html",
    "user-edit": "/html/auth/user/edit.html",
    "role": "/html/auth/role.html",
    "role-list": "/html/auth/role/list.html",
    "role-add": "/html/auth/role/add.html",
    "role-edit": "/html/auth/role/edit.html",
    
    "change-password": "/html/auth/change-password.html"
},
cache = {};

exports.load = function( id, fn ){
    var path = map[id];
    if( cache[path] ) return fn( $(cache[path]) );
    if( !path ) return Error("Please config it in " + module.id);
    $.get(path, function( html ){
        cache[path] = html;
        return fn( $(html) );
    }, "html");
}

});