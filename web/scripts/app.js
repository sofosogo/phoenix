define(function(require, exports, module){

var base = "/scripts/",
    common = base + "common/",
    app = base + "app/",
    auth = app + "auth/",
    clothes = app + "clothes/",
    profile = app + "profile/",
    alias = {
        'es5-safe': 'es5-safe/0.9.2/es5-safe',
        'json': 'json/1.0.1/json',
        'jquery': 'jquery/1.7.1/jquery'
    };

["extend", "html-handler", "ajax", "msg", "datahub-extends", "audio"]
.forEach(function(it){
    alias[it] = common + it;
});
["component", "tabs", "table", "ajax-upload", "dragable", "pagination-bootstrap"].forEach(function(it){
    alias[it] = common + "ui/" + it;
});

["main", "login", "home", "logout", "nav"].forEach(function(it){
    alias[it] = app + it;
});

["user", "role"].forEach(function(it){
    alias[it] = auth + it;
});
["user-list", "user-add", "user-edit"].forEach(function(it){
    alias[it] = auth + it.replace("-", "/");
});
["clothes"].forEach(function(it){
    alias[it] = clothes + it;
});
["clothes-list", "clothes-add", "clothes-edit"].forEach(function(it){
    alias[it] = app + it.replace("-", "/");
});
["profile", "change-password", "update-profile"].forEach(function(it){
    alias[it] = profile + it;
});

seajs.config({
    alias: alias,
    preload: [
        Function.prototype.bind ? '' : 'es5-safe', 
        this.JSON ? '' : 'json',
        "datahub-extends"
    ],
    debug: true,
    map: [
        ['http://example.com/js/app/', 'http://localhost/js/app/']
    ],
    base: 'http://example.com/path/to/libs/',
    charset: 'utf-8',
    timeout: 20000
});

seajs.use(["main", "nav", "extend", "ajax", "msg", "table", "tabs", "audio"], function( main ){
    $(window).hashchange(function(){
        main.hashchange();
    });
    main.hashchange();
});

});
