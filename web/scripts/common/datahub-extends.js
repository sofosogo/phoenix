define(function(require, exports, module) {
    
var dh = window.datahub,
    ls = dh.listen;
    
dh.require = function( k, fn ){
    var sc = this.shortcut[k];
    var url = sc.url;
    url = $.isFunction(url) ? url() : url;
    if( sc && sc.url ){
        require("ajax").get( url, function( data ){
            dh.put(k, data);
            fn && fn( data );
        });
    }
}
dh.listen = function( k ){
    var sc = this.shortcut[k];
    if( !sc.loaded && sc.cond() ) this.require(k);
    return ls.apply(this, arguments);
}

dh.shortcut = {
    "user": {
        url: function(){
            return "/user/" + getCookie("uid");
        },
        cond: function(){
            return getCookie("uid");
        }
    }
};

});