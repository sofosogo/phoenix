define(function(require, exports, module) {

var view = $("div.topbar");
view.find("a[href]");

var $navLogin = $("ul.pull-right"),
    navLoginTemp = dit.create( $navLogin[0] );
    
navLoginTemp.listen("user");
navLoginTemp.fill();
    
});