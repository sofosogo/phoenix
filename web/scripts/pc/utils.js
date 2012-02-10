(function(){

Date.prototype.format = function( format ){
    if( typeof format !== "string" ) return this.toLocaleString();
    var match = {
        "y": this.getFullYear(),
        "M": this.getMonth() + 1,
        "d": this.getDate(),
        "h": this.getHours(),
        "m": this.getMinutes(),
        "s": this.getSeconds(),
        "S": this.getMilliseconds()
    };
    return format.replace(/([ymdhs])+/ig, function(val, type, idx){
        return val.length === 1 ? match[type] : ("00" + match[type]).substr( ("00" + match[type]).length - val.length );
    });
}

})();
