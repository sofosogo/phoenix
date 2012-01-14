var error = require("../../error"),
    users = require("../users").users;

exports.get = function(req, res, params){
    var uid = parseInt(params.uid),
        user = users.findByUid( uid );
    if( !user ) return error.throw(res, 404);
    res.end( JSON.stringify(user) );
}

exports.put = function(req, res, params){
    var i = users.getMax(),
        user = {
            uid: i, 
            passport: params.passport, 
            name: params.name, 
            create_date: new Date().getTime()
        };
    users.push( user );
    res.end( JSON.stringify({code: 0}) );
}

exports.post = function(req, res, params){
    var uid = parseInt(params.uid),
        user = users.findByUid( uid );
    if( !user ) return error.throw(res, 500, "不能找到uid为" + uid + "的用户。");
    user.passport = params.passport;
    user.name = params.name;
    res.end( JSON.stringify({code: 0}) );
}

exports["delete"] = function(req, res, params){
    var uid = parseInt(params.uid),
        user;
    for( var i = 0; i < users.length; i++ ){
        if( users[i].uid === uid ){
            user = users[i];
            users.splice(i, 1);
            break;
        }
    }
    if( !user ) return error.throw(res, 500, "不能找到uid为" + uid + "的用户。");
    res.end( JSON.stringify({code: 0}) );
}