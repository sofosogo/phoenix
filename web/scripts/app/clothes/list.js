define(function(require, exports, module) {

var component = require("component"),
    table = require("table"),
    list = new component();
list.viewname = "clothes-list";
list.init = function( $v ){
    var _t = this,
        temp = this.dit().fill(),
        $search = $v.find("input[name=search]");
    function search(){
        if( !_t.table ){
            _t.table = createTable();
            _t.table.parent = _t;
            _t.table.ready(function(){
                _t.append( _t.table.view() );
                search();
            });
            return;
        }
        $search.button("loading");
        _t.table.search( temp.fetch(), function(){
            $search.button("reset");
        });
    }
    $v.find("input[name=name]").keyup(function(e){
        if( e.keyCode === 13 ) search();
    });
    $search.click( search );
}

module.exports = list;

function createTable(){
    var clothestable = new table({
        url: "/clothes",
        cols: [{
            name: "id",
            title: "#"
        },{
            name: "name",
            title: "名字",
            color: "yellow",
            gen: function( v, it ){
                return "<a class='edit' title='查看更新' href='/clothes/" + it.id + "'>" + v + "</a>"
            }
        },{
            name: "price",
            title: "价格",
            color: "green"
        }]
    });
    clothestable.init = function( $v ){
        var _p = this.parent.parent;
        $v.delegate("a.edit", "click", function(e){
            e.preventDefault();
            var id = this.getAttribute("href");
            id = id.substring( id.lastIndexOf("/")+1 );
            _p.showTab("clothes-edit", function(edit){
                edit.setId( id );
            });
        });
    }
    return clothestable; 
}
});