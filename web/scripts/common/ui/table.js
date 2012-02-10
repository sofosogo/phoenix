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
    this.pagination = new pagination({
        parent: _t,
        click: function( page ){
            _t.fetch( page );
        }
    }).appendToParent("tfoot td");
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
        this.pagination.set(result.total, this.pagesize, result.page);
        this.show();
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
default_table_view = '<table class="table table-striped table-condensed">'+
        '<thead></thead>' +
        '<tbody></tbody>' +
        '<tfoot><tr><td></td></tr></tfoot>' +
    '</table>',
component = require("component"),
pagination = require("pagination-bootstrap");
table.prototype = _.extend( new component(), prototype );

});