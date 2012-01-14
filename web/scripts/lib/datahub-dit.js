(function(){

var dh = window.datahub;
dit.proto.listen = function( msg, opt ){
    var _t = this;
    return dh.listen( msg, function( data ){
        console.log( data );
        _t.fill( data.data );
    }, opt );
}

})();