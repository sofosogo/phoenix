define(function(require, exports, module){
    var $msg = $("div.alert-message"),
        temp = dit.create( $msg[0] ),
        type,
        tick;
    ["warning", "error", "success", "info"].forEach(function(it){
       exports[it] = function( msg, second ){
           temp.fill( {type: it, msg: msg} );
           $msg.show();
           clearTimeout( tick );
           if( second !== 0 ){
               tick = setTimeout(function(){
                   $msg.hide();
               }, (second||3) * 1000);
           }
           
       }
    });
    
    $msg.find("a").click(function(){
        $msg.hide();
    });
});

