var amanda = require("amanda");

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
        res.render( clothes );
    });
}

exports.put = function(req, res, params){
    params.price = parseInt(params.price);
    
    db.collection("clothes").find().sort( {id: -1} ).nextObject(function(err, lastclothes){
        if( err ) return error.throw(res, 500);
        var id = lastclothes ? lastclothes.id + 1 : 1,
            c = obj_utils.partial(params, "name", "price", "desc");
        c.id = c._id = id;
        c.created_dt = new Date().getTime();
        
        db.collection("clothes").insert(c, function(err, clothes){
            if( err ) return error.throw(res, 500);
            res.end( JSON.stringify({code: 0}) );
        });
    });
}
var schema = {
    type: 'object',
    properties: {
        "name": {
            required: true,
            type: 'string',
            length: [1, 30]
        }, 
        "price": {
            required: true,
            type: 'string',
            length: [0, 6]
        }, 
        "desc": {
            type: 'string',
            length: [0, 400]
        }
    }
}
exports.put.validate = [function(req, res, next, params){
    amanda.validate(params, schema, function(err){
        if( err ) return error.throw(res, 1, err);
        next();
    });
}];

exports.post = function(req, res, params){
    params.price = parseInt(params.price);
    
    var id = parseInt(params.id),
        query = {id: id},
        sort = [],
        update = { 
            $set: obj_utils.partial(params, 
                "name", "price", "tburl", "desc", "imgs", "recommend", "size", "category", "color")
        },
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