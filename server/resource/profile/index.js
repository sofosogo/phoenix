
var error = require("../../error"),
    db = require("../mongodb"),
    obj_utils = require("../../utils/object");

exports.path = "/profile/{uid}";

exports.get = function(req, res, params){
    var _id = parseInt(params.uid);
    db.collection("user").findOne({_id: _id}, function(err, user){
        if( err ) error.throw(res, 500);
        if( !user ) error.throw(res, 404);
        var result = obj_utils.partial(user, "uid", "passport", "name", "email", "role");
        res.end( JSON.stringify(result) );
    });
}

exports.post = function(req, res, params){
    var _id = parseInt( params.uid );
    var profile = obj_utils.partial(params, "name", "email");
    db.collection("user").findAndModify({_id: _id}, [], {$set: profile}, {}, function(err, user){
        if( err ) error.throw(res, 500);
        if( !user ) error.throw(res, 404);
        res.render( {code: 0} );
    });
}
