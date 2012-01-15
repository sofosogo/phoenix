var error = require("../../error"),
    db = require("../mongodb"),
    config = require("../../config");

exports.get = function(req, res, params){
    var uid = parseInt(params.uid);
    db.collection("user").findOne({uid: uid}, function(err, user){
        if( err ) return error.throw(res, 500);
        if( !user ) return error.throw(res, 404);
        res.end( JSON.stringify(user) );
    });
}

exports.put = function(req, res, params){
    db.collection("user").find().sort( {uid: -1} ).nextObject(function(err, lastuser){
        if( err ) return error.throw(res, 500);
        var user = {
            _id: lastuser.uid + 1,
            uid: lastuser.uid + 1,
            passport: params.passport,
            password: config.default_password,
            name: params.name
        };
        db.collection("user").insert(user, function(err, user){
            if( err ) return error.throw(res, 500);
            res.end( JSON.stringify({code: 0}) );
        });
    });
}
exports.put.validate = [function(req, res, next, params){
    var query = { "passport": params.passport };
    db.collection("user").findOne(query, function(err, user){
        if( err ) return error.throw(res, 500);
        if( user ) return error.throw(res, 500, params.passport + "已经存在。");
        next();
    })
}];

exports.post = function(req, res, params){
    var uid = parseInt(params.uid),
        query = {uid: uid},
        sort = [],
        update = { $set: { passport: params.passport, name: params.name } },
        options = {};
    db.collection("user").findAndModify(query, sort, update, options, function(err, user){
        if( err ) return error.throw(res, 500);
        if( !user ) return error.throw(res, 404);
        res.end( JSON.stringify({code: 0}) );
    });
}

exports["delete"] = function(req, res, params){
    var uid = parseInt(params.uid),
        user;
    db.collection("user").remove({"uid": uid}, function(err, user){
        if( err ) return error.throw(res, 500);
        res.end( JSON.stringify({code: 0}) );
    });
}