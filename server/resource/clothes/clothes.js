var util = require("util");

var db = require("../mongodb"),
    error = require("../../error"),
    obj_utils = require("../../utils/object");

var logger = require("log4js").getLogger(__filename);

exports.path = "/clothes";

exports.get = function(req, res, params){
    var page = Math.abs(parseInt(params.page)) || 1,
        pagesize = parseInt(params.pagesize) || 10,
        skip = (page - 1) * pagesize,
        len = 0,
        query = obj_utils.partial(params, "recommend");
    if( params.name ) query.name = new RegExp( decodeURI(params.name) );
    if( params.min_price || params.max_price ){
        var p = query.price = {};
        if( params.min_price ) p.$gte = parseInt(params.min_price);
        if( params.max_price ) p.$lte = parseInt(params.max_price);
    }
    if( params.fabric ) query["category.fabric"] = {"$in": params.fabric};
    if( params.season ) query["category.season"] = {"$in": params.season};
    
    logger.info( "query clothes: " + util.inspect(query) );
    
    var cursor = db.collection("clothes").find( query );
    cursor.count(function(err, count){
        if( err ) throw err;
        if( skip > count ){
            skip = 0;
            page = 1;
        }
        cursor.sort({id: 1}).skip(skip).limit(pagesize);
        cursor.toArray(function(err, clothes){
            if( err ) return error.throw(res, 500);
            var result = {data: clothes, total: count, page: page };
            res.end( JSON.stringify(result) );
        });
    });
}
