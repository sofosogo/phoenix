(function(){
    
var p = window.pagination = function( opt ){
    this.$view = opt.$view || $(default_view);
    this.$ul = this.$view.find("ul");
    this.$total = this.$view.find(".total-size");
    this.$view.delegate("a", "click", function(e){
        var page = this.getAttribute("page")
        if( page && opt.click ){
            opt.click( page );
        }
        e.preventDefault();
        return false;
    });
}
p.prototype = {
    set: function(total, pagesize, curpage){
        total = Math.ceil( total / pagesize );
        var index = getStartEnd(total, 11, curpage),
            str = "";
        if( total > 0 ){
            str += genIndex(total, curpage, 1, "|&lt;");
            str += genIndex(total, curpage, curpage-1, "&lt;");
        }
        for( var i = index[0], end = index[1]; i <= end; i++ ){
            str += genIndex(total, curpage, i);
        }
        if( total > 0 ){
            str += genIndex(total, curpage, curpage+1, "&gt;");
            str += genIndex(total, curpage, total, "&gt;|");
        }
        this.$ul.html( str );
        this.$total.html( "共<span class='red'>" + total + "</span>条记录。" );
    }
}

function getStartEnd( total, max, cur ){
    var start = 1, end = total, half = Math.floor(max/2);
    if( total > max ){
        start = cur - half;
        end = cur + half;
        if( start < 1 ){
            start = 1;
            end = max;
        }else if( end > total ){
            end = total;
            start = total - max;
        }
    }
    return [start, end];
}
function genIndex(total, curpage, page, title){
    var clazz = "",
        disabled = (curpage === page || page < 1 || page > total),
        href =  disabled ? "" : " href='" + page + "'";
    if( disabled ){
        clazz = title ? "disabled": "active";
    }
    // here we don't use href but also page, hack for IE6, href="http://host/2"
    return "<li class='" + clazz + "'><a page='" + page + "' " + href + ">" + (title || page) + "</a></li>";
}
var default_view = '<div class="pagination"><ul></ul><div class="total-size"></div></div>';

})();
