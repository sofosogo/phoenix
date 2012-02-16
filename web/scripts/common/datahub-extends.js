define(function(require, exports, module) {
    
var dh = window.datahub,
    ls = dh.listen;
    
dh.require = function( k, fn ){
    var sc = this.shortcut[k];
    var url = sc.url;
    url = $.isFunction(url) ? url() : url;
    if( sc && sc.url && sc.status !== "loading" ){
        require("ajax").get( url, function( data ){
            sc.status = "loaded";
            dh.put(k, data);
            fn && fn( data );
        });
        sc.status = "loading";
        setTimeout(function(){
            sc.status = "timeout";
        }, 5000);
    }
}
dh.listen = function( k, fn ){
    this.msgbus.listen( k, fn );
    //var sc = this.shortcut[k];
    //if( !sc.loaded && sc.cond() ) this.require(k);
    //return ls.apply(this, arguments);
}

dh.shortcut = {
    "user": {
        url: function(){
            return "/profile/" + getCookie("uid");
        },
        cond: function(){
            return getCookie("uid");
        }
    }
};

});