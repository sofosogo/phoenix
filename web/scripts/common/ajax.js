define(function(require, exports, module) {

    exports.ajax = 
    exports.request = function( opt ){
        $.ajax( opt );
    };
    
    ["get", "put", "post", "del"].forEach(function(it){
        var real = it;
        if (real === "del"){ 
            real = "delete";
        }
        exports[it] = function(url, data, success){
            if( $.isFunction(data) ){
                success = data;
                data = void 0;
            }
            $.ajax({
                url: url,
                type: real,
                data: data,
                success: success
            });
        }
    });
});