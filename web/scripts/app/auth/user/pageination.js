define(function(require, exports, module){

module.exports = pagination;
function pagination( opt ){
    var $view = this.$view = opt.$view || $(default_pagination_view);
}
var default_pagination_view = 
    '<div class="pagination">';
});