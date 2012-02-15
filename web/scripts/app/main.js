define("main", [], function(require, exports, module) {

var component = require("component"),
    main = new component();
main.hashchange = function( hash ){
    if( hash ) location.hash = hash;
    var hash = location.hash.slice(1);
    if( !hash ) hash = location.hash = "home";
    console.log( "hash changed: " + hash );
    
    if( !getCookie("sid") && hash !== "login" ){
        return main.hashchange("login");
    }
    if( !hash ) return;
    console.log("load " + hash + " module.");
    seajs.use(hash, function(m){
        m.ready(function($v){
            main.$container.children().detach();
            main.$container.html( $v );
            m.onShow();
        });
    });
}
main.$container = $("#main div.slides");

module.exports = main;

});