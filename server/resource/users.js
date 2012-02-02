var db = require("./mongodb"),
    error = require("../error");

exports.get = function(req, res, params){
    var page = parseInt(params.page),
        pagesize = parseInt(params.pagesize);
        skip = (page - 1) * pagesize,
        len = 0,
        query = {};
    if( params.passport ) query.passport = params.passport;
    var cursor = db.collection("user").find( query );
    cursor.count(function(err, count){
        if( err ) throw err;
        if( skip > count ){
            skip = 0;
            page = 1;
        }
        cursor.sort({uid: 1}).skip(skip).limit(pagesize);
        cursor.toArray(function(err, users){
            if( err ) return error.throw(res, 500);
            var result = {data: users, total: count, page: page };
            res.end( JSON.stringify(result) );
        });
    });
}
