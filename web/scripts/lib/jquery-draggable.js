
(function($){

    $.fn.draggable = function( options ){
        var opts = $.extend({}, $.fn.draggable.defaults, options);
        
        var $ctnr = opts.container;
        var x1, y1, sx, sy, $it;
        
        this.bind( "mousedown.ctdrag", function( e ){
            $it = $(this);
            e.preventDefault();
            var pos = $it.position();
            x1 = pos.left;
            y1 = pos.top;
            sx = e.clientX;
            sy = e.clientY;
            var result = opts.start.call( $it, x1, y1, e );
            if( result === false ) return false;
            
            if( opts.css ) $it.addClass( opts.css );
            var pre = new Date(),
                now;

            $ctnr.bind( "mousemove.ctdrag", function( e ){
                e.preventDefault();
                var x = e.clientX,
                    y = e.clientY;
                var x2 = x1 + x - sx,
                    y2 = y1 + y - sy;
                now = new Date();
                var result = opts.move.call( $it, x2, y2, e, x-sx, y-sy, now - pre );
                if( result === false ) return false;
                pre = now;
                $it.css( {left: x2, top: y2} );
            });
            $ctnr.bind( "mouseup.ctdrag", end );
            $ctnr.bind( "mouseleave.ctdrag", unbind );
        });
        
        var end = function( e ){
            unbind();
            var x = e.clientX,
                y = e.clientY;
            var x2 = x1 + x - sx,
                y2 = y1 + y - sy;
            var result = opts.end.call( $it, x2, y2, e, x-sx, y-sy );
            if( result === false ) return false;
            $it.css( {left: x2, top: y2} );
        };
        var unbind = function(){
            if( opts.css ) $it.removeClass( opts.css );
            $ctnr.unbind( ".ctdrag" );
        }
    };
    
    $.fn.undraggable = function(){
        return this.unbind( ".ctdrag" );
    };
    
    $.fn.draggable.defaults = {
        start: function(x, y, e){},
        move: function(x, y, e, dx, dy, dt){},
        end: function(x, y, e, dx, dy){},
        css: null,
        container: $(document)
    };
    
})(jQuery);
