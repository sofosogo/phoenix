
exports.throw = function( res, code, msg ){
    console.log("Error: " + code);
    res.statusCode = 200;
    res.end( JSON.stringify({code: code, msg: msg}) );
}
