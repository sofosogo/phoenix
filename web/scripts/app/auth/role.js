define(function(require, exports, module) {

exports.init = function(){
    require("main").show("role", function($v){
        $v.tabs();
        var load = {};
        $v.find("li>a").bind("change", function(e){
            var href = e.target.getAttribute("href");
            if( !load[href] ){
                load[href] = 1;
                require("html-handler").load( href.slice(1), function( $slide ){
                    $(href).append( $slide );
                });
            }
        });
    });
}

});