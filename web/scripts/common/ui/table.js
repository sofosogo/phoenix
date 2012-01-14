define(function(require, exports, module){

module.exports = table;

function table( opt ){
    var $view = this.$view = opt.$view || $(default_table_view),
        cols = this.cols = opt.cols, 
        col, $head, $trs, $tr
        _t = this;
    this.url = opt.url;
    this.pagesize = opt.pagesize || 10;
    
    this.$total = this.view(".total-size");
    this.view("thead td, tfoot td").attr("colspan", cols.length);
    $head = $("<tr>");
    for( var i = 0, len = cols.length; i < len; i++ ){
        col = cols[i];
        $("<th>", {
            "name": col.name,
            "text": col.title || col.name,
            "class": ["header", col.color].join(" "), 
        }).appendTo( $head );
    }
    this.view("thead").append( $head );
    this.view(".pagination").delegate("a", "click", function(e){
        var page = this.getAttribute("href")
        page && _t.fetch( page );
        e.preventDefault();
        return false;
    });
};
var prototype = {
    fill: function( result ){
        var data = result.data,
            cols = this.cols,
            $tr, dlen, clen, val, gen;
        this.show().view("tbody").empty();
        this.$total.html("共有" + result.total + "条记录。");
        for( var i = 0; i < this.pagesize && i < data.length; i++ ){
            $tr = $("<tr>");
            for( var j = 0, len = cols.length; j < len; j++ ){
                val = data[i][cols[j].name];
                gen = cols[j].gen;
                $("<td>").append( gen ? gen(val, data[i]) : val )
                    .appendTo( $tr );
            }
            this.view("tbody").append( $tr );
        }
        this.pagination(result.total, this.pagesize, result.page);
        this.show();
    },
    pagination: function(total, pagesize, curpage){
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
        this.view(".pagination ul").html( str );
    },
    fetch: function( page, fn ){
        var _t = this;
        _t.material.page = page;
        require("ajax").get(_t.url, _t.material, function(data){
            _t.fill( data );
            $.isFunction(fn) && fn();
        })
    },
    search: function( cond, fn ){
        this.material = cond;
        this.material.pagesize = this.pagesize; 
        this.fetch( 1, fn );
    }
},
default_table_view = '<table class="zebra-striped">'+
        '<thead></thead>' +
        '<tbody></tbody>' +
        '<tfoot><tr><td><div class="pagination"><ul></ul><div class="total-size"></div></div></td></tr></tfoot>' +
    '</table>',
component = require("component");

table.prototype = _.extend( new component(), prototype );

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
    return "<li class='" + clazz + "'><a" + href + ">" + (title || page) + "</a></li>";
}

});