define(function(require, exports, module) {

var component = require("component"),
    table = require("table"),
    list = new component();
list.viewname = "user-list";
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
    $v.find("input[name=passport]").keyup(function(e){
        if( e.keyCode === 13 ) search();
    });
    $search.click( search );
}

module.exports = list;

function createTable(){
    var usertable = new table({
        url: "/users",
        cols: [{
            name: "uid",
            title: "#"
        },{
            name: "passport",
            title: "通行证",
            color: "yellow",
            gen: function( v, it ){
                return "<a class='edit' title='查看更新' href='/user/" + it.uid + "'>" + v + "</a>"
            }
        },{
            name: "name",
            title: "昵称",
            color: "green"
        }]
    });
    usertable.init = function( $v ){
        var _p = this.parent.parent;
        $v.delegate("a.edit", "click", function(e){
            e.preventDefault();
            var uid = this.getAttribute("href");
            uid = uid.substring( uid.lastIndexOf("/")+1 );
            _p.showTab("user-edit", function(edit){console.log(edit);
                edit.showUser( uid );
            });
        });
    }
    return usertable; 
}
});