(function(){

window.height = function(){
    var height = window.innerHeight;
    if( typeof height !== "number" ){
        if( document.compatMode === "CSS1Compat" ) {
            height = document.documentElement.clientHeight;
        }else{
            height = document.body.clientHeight;
        }
    }
    return height;
}
window.width = function(){
    var width = window.innerWidth;
    if( typeof width !== "number" ){
        if( document.compatMode === "CSS1Compat" ) {
            width = document.documentElement.clientWidth;
        }else{
            width = document.body.clientWidth;
        }
    }
    return width;
}

})();
