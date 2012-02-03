
var slice = Array.prototype.slice;

exports.partial = function(obj /*keys..*/){
    var keys = slice.call(arguments, 1),
        key, 
        part = {};
    for(var i = 0, len = keys.length; i < len; i++){
        key = keys[i];
        if( obj[key] !== void 0)
            part[key] = obj[key];
    }
    return part;
}
