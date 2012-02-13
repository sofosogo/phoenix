define(function(require, exports, module){
    var $alerts = $("div.alerts");
    var $alert = $("div.alert").removeClass("hide").remove();
    ["warning", "error", "success", "info"].forEach(function(it){
        exports[it] = function( msg, second ){
            var $a = $alert.clone()
                .appendTo( $alerts );
            $a.addClass( "alert-" + it )
                .find("p").html( msg );
           if( second !== 0 ){
               setTimeout(function(){
                   $a.hide();
               }, (second||3) * 1000);
           }
       }
    });
    $alerts.delegate("a", "click", function(e){
        $(this).parent().remove();
    });
    
    //exports.info("info", 0);
    //exports.success("success", 3);
    //exports.error("error", 4);
    //exports.warning("warning", 0);
});

