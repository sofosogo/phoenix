define(function(require, exports, module){

exports.dragable = function( $p, opt ){
    opt = opt || {};
    var selector = opt.selector || "li",
        callback = opt.callback || function(){};
    
    $p.delegate(selector, "mousedown", function(e){
        e.preventDefault();
        e.stopPropagation();
        var $lis = $p.children(),
            $me = $(this),
            diff = $me.position().left - e.clientX,
            max = [$p.position().left, $p.position().left+$p.width()-$me.width()],
            $next, $prev, threshold, $sd,
            changed = false;
        function init(){
            $next = $me.next();
            $prev = $me.prev();
            threshold = [
                $prev.length > 0 ? $prev.position().left + $prev.width()/4 : -10000,
                $next.length > 0 ? $me.position().left + $me.width()*3/4 : 10000
            ];
        }
        init();
       
        $sd = $me.clone()
            .css({
                "position": "absolute",
                "left": $me.position().left + "px",
                "top": $me.position().top + "px"
            }).appendTo( $p );
        $me.addClass("hidden");
       
        $sd.mousemove(function( e ){
            e.preventDefault();
            e.stopPropagation();
            
            var dir = e.clientX - this.clientX > 0 ? "R" : "L",
                left = e.clientX + diff;
            if( left < max[0] || left > max[1] ) return;
            
            this.clientX = e.clientX;
            $sd.css({"left": left + "px"});
            
            var moved = false;
            if( moved = (dir === "R" && left > threshold[1]) ){
                $next.after( $me );
            }else if( moved = (dir === "L" && left < threshold[0]) ){
                $prev.before( $me );
            }
            if( moved ){
                changed = true;
                init();
            }
        });
       
        function fn( e ){
            e.preventDefault();
            e.stopPropagation();
            $me.removeClass("hidden");
            $lis.removeClass("active");
            $me.addClass("active");
            $sd.remove();
            if( changed ) callback();
        }
        $sd.bind({
            "mouseleave": fn,
            "mouseup": fn
        });
    });
}

});
