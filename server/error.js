
exports.throw = function( res, code, msg ){
    throw {res: res, code: code, msg: msg};
}
