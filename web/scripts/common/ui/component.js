define(function(require, exports, module){

module.exports = component;

function component(){}

component.prototype = {
    init: function(){},
    hide: function( selector ){
        this.view(selector).hide();
        return this;
    },
    show: function( selector ){
        this.view(selector).show();
        return this;
    },
    append: function( $v, to ){
        this.view( to || this._default_view_name ).append( $v );
        return this;
    },
    appendToParent: function( to ){
        this.parent.view(to).append( this.$view );
        return this;
    },
    load: function( viewname, fn ){
        var _t = this;
        console.log("Load view: " + name);
        require("html-handler").load( viewname, function( $v ){
            if( $.isFunction(fn) ) fn( $v );
        });
    },
    view: function( name ){
        var $v = this.$view,
            $p;
        if( !name ) return $v;
        this._views = this._views || {};
        if( $p = this._views[name] ) return $p; // find in cache
        $p = $v.find( name ); // find as selector
        return  this._views[name] = $p;
    },
    dit: function( selector ){
        if( !this._dits ) this._dits = {};
        var name = selector || "_DEFAULT";
        if( !this._dits[name] ){
            this._dits[name] = dit.create( this.view(selector) );
        }
        return this._dits[name];
    },
    ready: function( fn ){
        var _t = this;
        if( this.$view ){
            if( !this.inited ){
                _t.init( this.$view );
                _t.inited = true;
            }
            return fn( this.$view );
        }
        this.load(this.viewname, function($v){
            _t.$view = $v;
            _t.init( $v );
            _t.inited = true;
            $.isFunction(fn) && fn($v); 
        });
    }
}

});