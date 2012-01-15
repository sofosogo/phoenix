
exports.path = "/role/{rid}";
exports.auth = "admin";
exports.get = function(req, res, params){
    var role = {
        rid: params.rid,
        
    };
    res.end( JSON.stringify(role) );
}
exports.get.auth = "admin";
