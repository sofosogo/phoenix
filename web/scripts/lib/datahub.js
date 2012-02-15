(function( UNDEF ){

var datahub = window.dh = window.datahub = {
    put: function( key, data, opt ){
        if( opt && opt.parent ) key = getKey( opt.parent, key );
        save( key, data, opt && opt.recur );
        return data;
    },
    get: function( key ){
        return get( key, outer );
    },
    post: function( data ){
        return save( data.__key, data, data.__recur );
    },
    del: del,
    listen: listen
}

var inner = { __key: "ROOT" },
    outer = { __key: "ROOT" },
    diffs = [],
    node_prototype = {
        clone: function(){
            return clone( this, function( key, val ){ return key.indexOf("__") !== 0 && typeof val !== "function"} );
        },
        save: function(){
            return save( this.__key, this, this.__recur );
        },
        del: function( key ){
            return key ? del( key, this ) : del( this.__key );
        }
    };

function get( key, obj ){
    if( typeof key !== "string" ) return UNDEF;
    var arr = key.split(".");
    for( var i = 0; i < arr.length; i++ ){
        if( !obj ) return UNDEF;
        if( arr[i] ) obj = obj[arr[i]];
    }
    return obj;
}
function save( key, data, recur ){
    data = wrap( data, key, recur );
    var inn = get( key, inner );
    checkDiff( data, inn, key );
    _save( inner, key, clone( data ) );
    _save( outer, key, data );
}
function _save( pool, key, data ){
    if( !key ) return;
    var arr = key.split(".");
    var obj = pool;
    for( var i = 0; i < arr.length - 1; i++ ){
        if( arr[i] ) obj = obj[arr[i]] = obj[arr[i]] || {};
    }
    obj[arr[i]] = data;
}
function del( key, out ){
    var inn;
    if( !out ){
        var lastIndex = key.lastIndexOf("."),
            objKey = key.substring( 0, lastIndex );
        inn = get( objKey, inner );
        out = get( objKey, outer );
        key = key.substring(lastIndex + 1);
    }else{
        inn = get( out.__key, inner );
    }
    if( isArray(out) && typeof parseInt(key) === "number" ){
        out.splice( parseInt(key), 1 );
        checkDiff( UNDEF, inn[key], getKey(out.__key, key) );
        save( out.__key, out )
    }else{
        checkDiff( UNDEF, inn[key], getKey(out.__key, key) );
        out[key] = inn[key] = UNDEF;
    }
    
}

function listen( key, obj, fn, opt ){
    return msgbus.listen( key, obj, fn, opt );
}
function fire(){
    var diff;
    while( diff = diffs.shift() ){
        console.log("dh: " + diff.key + "changed.")
        msgbus.fire( diff.key, diff );
    }
}

function wrap( data, key, recur ){
    if( !data || typeof data !== "object" ) return data;
    bindFn( data );
    data.__key = key;
    if( recur === false )
        data.__recur = false;
    else
        for( var k in data ) 
            data[k] = wrap( data[k], getKey(key, k) );
    return data;
}

function clone( data, fn ){
    if( !data || typeof data !== "object" ) return data;
    var dc = isObject(data) ? {} : [];
    for( var k in data ){
        if( typeof fn !== "function" || fn(k , data[k]) ) 
            dc[k] = clone( data[k] );
    }
    return dc;
}

function bindFn( data ){
    if( data.__key ) return data;
    for( var k in node_prototype ){
        data[k] = node_prototype[k];
    }
}

function getKey( parent, key ){
    return parent === "ROOT" ? key : parent + "."+ key;
}

function checkDiff( nd, od, key ){
    var eq = true;
    key = key || nd.__key || "";
    if( typeof nd === "object" && typeof od === "object" ){
        var attrs = {}, r;
        for( var i in nd ) attrs[i] = 0;
        for( var i in od ) attrs[i] = 0;
        for( var i in attrs ){
            r = checkDiff( nd[i], od[i], getKey(key, i) );
            if( !r ) eq = false;
        }
        
    }else{
        eq = ( nd === od );
    }
    if( !eq ) diffs.push( { key: key, data: nd } );
    if( arguments.callee.caller !== checkDiff && diffs.length > 0){
        var k = diffs[0].key;
        while( k = k.substring(0, k.lastIndexOf(".")) ){
            diffs.push( { key: k, data: get(k, outer) } );
        }
        fire();
    }
    return eq;
}

var msgbus = dh.msgbus = window.msgbus.getInstance("datahub"),
    toString = Object.prototype.toString,
    isArray = function( arr ){
        return arr && toString.call(arr) === "[object Array]";
    },
    isObject = function( obj ){
        return obj && toString.call(obj) === "[object Object]";
    };

})();
