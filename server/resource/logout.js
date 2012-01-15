exports.put = function(req, res, params, cookies){
    console.log("logout");
    cookies.set("sid", "", {httpOnly: false});
    cookies.set("uid", "", {httpOnly: false});
    res.end( JSON.stringify( {code: 0}) );
}