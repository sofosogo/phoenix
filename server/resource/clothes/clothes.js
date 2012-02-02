var util = require("util");

var db = require("../mongodb"),
    error = require("../../error");

var logger = require("log4js").getLogger(__filename);

exports.path = "/clothes";

exports.get = function(req, res, params){
    var page = parseInt(params.page),
        pagesize = parseInt(params.pagesize);
        skip = (page - 1) * pagesize,
        len = 0,
        query = {};
    if( params.name ) query.name = new RegExp( decodeURI(params.name) );
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
            if( err ) return Error.throw(res, 500);
            var result = {data: clothes, total: count, page: page };
            res.end( JSON.stringify(result) );
        });
    });
}
