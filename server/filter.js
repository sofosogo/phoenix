var config = require("./config");

//load filter modules after starting server.
var filters = config.filters;
for( var i = 0, len = filters.length; i < len; i++ ){
    filters[i] = require(filters[i]);
}

exports.filter = function(req, res, next){
    var i = 0
        len = filters.length, 
        callback = function(){
            if( i === len - 1 ){
                next(req, res);
            }else{
                filters[++i].filter( req, res, callback );
            }
        };
    filters[i].filter( req, res, callback );
}