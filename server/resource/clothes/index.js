var error = require("../../error"),
    db = require("../mongodb"),
    
    obj_utils = require("../../utils/object");
    
var logger = require("log4js").getLogger(__filename);

exports.get = function(req, res, params){
    var id = parseInt(params.id);
    logger.info("Get the clothoes whose id is %s.", id);
    db.collection("clothes").findOne({id: id}, function(err, clothes){
        if( err ) return error.throw(res, 500);
        if( !clothes ) return error.throw(res, 404);
        res.end( JSON.stringify(clothes) );
    });
}

exports.put = function(req, res, params){
    db.collection("clothes").find().sort( {id: -1} ).nextObject(function(err, lastclothes){
        if( err ) return error.throw(res, 500);
        var id = lastclothes ? lastclothes.id + 1 : 1,
            clothes = {
                _id: id,
                id: id,
                name: params.name,
                price: params.price,
                desc: params.desc,
                created_dt: new Date().getTime()
            };
        db.collection("clothes").insert(clothes, function(err, clothes){
            if( err ) return error.throw(res, 500);
            res.end( JSON.stringify({code: 0}) );
        });
    });
}
exports.put.validate = [function(req, res, next, params){
    var query = { "passport": params.passport };
    db.collection("clothes").findOne(query, function(err, clothes){
        if( err ) return error.throw(res, 500);
        if( clothes ) return error.throw(res, 500, params.passport + "已经存在。");
        next();
    })
}];

exports.post = function(req, res, params){console.log(params);
    var id = parseInt(params.id),
        query = {id: id},
        sort = [],
        update = { $set: obj_utils.partial(params, "name", "price", "desc", "imgs") },
        options = {};
    db.collection("clothes").findAndModify(query, sort, update, options, function(err, clothes){
        if( err ) return error.throw(res, 500);
        if( !clothes ) return error.throw(res, 404);
        res.end( JSON.stringify({code: 0}) );
    });
}

exports["delete"] = function(req, res, params){
    var id = parseInt(params.id),
        clothes;
    db.collection("clothes").remove({"id": id}, function(err, clothes){
        if( err ) return error.throw(res, 500);
        res.end( JSON.stringify({code: 0}) );
    });
}