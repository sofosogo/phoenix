
exports.throw = function( res, code, msg ){
    console.log("Error: " + code);
    res.statusCode = code;
    res.end( msg );
}
