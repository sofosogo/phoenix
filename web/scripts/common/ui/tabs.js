define(function(require, exports, module){

module.exports = tabs;

function tabs(){
    var _t = this,
        $v = this.$view = $(default_tabs_view);
    this.tabs = {};
    $v.delegate(".nav-tabs li > a", "click", function(e){
        e.preventDefault();
        var name = e.target.getAttribute("href").slice(1);
        _t.showTab( name );
    });
}
var default_tabs_view = '<div>'
    + '<ul class="nav nav-tabs" style="position: relative;"></ul>'
    + '<div class="tab-content"></div>'
    + '</div>',
    
    prototype = {
        addTab: function(name, title, index){
            var $head = $("<li><a href='#" + name + "'>" + title + "</a></li>"),
                $body = $("<div>", {"class": "tab-pane " + name});
            this.view(".nav-tabs").append( $head );
            this.view(".tab-content").append( $body );
            this.tabs[name] = { head: $head, body: $body };
        },
        showTab: function( name, fn ){
            var tab = this.tabs[name],
                _t = this, pre;
            if( !tab.loaded ){
                tab.loaded = 1;
                seajs.use( name, function(m){
                    m.parent = _t;
                    tab.componet = m;
                    m.ready(function(){
                        _t.append( m.view(), "."+name )
                            .showTab( name, fn );
                    });
                });
                return;
            }
            tab.head.addClass("active");
            tab.body.addClass("active");
            if( pre = this.tabs[this.tabs._pre] ){
                pre.head.removeClass("active");
                pre.body.removeClass("active");
            }
            this.tabs._pre = name;
            $.isFunction(fn) && fn(tab.componet);
            tab.componet.onShow();
        }
    },
    component = require("component");

tabs.prototype = _.extend( new component(), prototype );

});
