var users = [],
    user,
    len = 303;
for( var i = 1; i <= len; i++ ){
    user = {
        uid: i, 
        passport: "yixiao"+i,
        password: "yixiao"+i,
        name: "一笑"+i, 
        create_date: new Date().getTime()
    };
    users.push( user );
}
users.getMax = function(){
    return ++len;
}
users.findByUid = function( uid ){
    for( var i = 0; i < users.length; i++){
        if(users[i].uid === uid){
            return users[i];
        }
    }
}
users.findByPassport = function( passport ){
    for( var i = 0; i < users.length; i++){
        if(users[i].passport === passport){
            return users[i];
        }
    }
}
exports.users = users;

exports.get = function(req, res, params){
    var us = users,
        page = parseInt(params.page),
        pagesize = parseInt(params.pagesize);
        start = (page - 1) * pagesize,
        len = 0;
    if( params.passport ){
        us = us.filter(function(u){
            return params.passport ? params.passport === u.passport : true;
        });
    }
    len = us.length;
    if( len > start ){
        us = us.slice( start, start + pagesize );
    }
    var result = {data: us, total: len, page: page };
    res.end( JSON.stringify(result) );
}
