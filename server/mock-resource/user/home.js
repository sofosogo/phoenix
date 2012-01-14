exports.get = function(req, res, params){
    var json = {
        "last_login_date": new Date() - 1000 * 60 * 60 * 25
    };
    res.end( JSON.stringify(json) );
}