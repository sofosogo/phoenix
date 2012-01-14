/**
 * 
 */
(function($, undefined){

$.fn.tabs_dragable = function(){
    var $tabs = this.find(".tabs");
    
    this.delegate("li", "mousedown", function(e){
        var $me = $(this),
            diff = $me.position().left - e.clientX,
            max = [$tabs.position().left, $tabs.position().left+$tabs.width()-$me.width()],
            $next, $prev, threshold, $sd;
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
            }).appendTo( $tabs );
        $me.css({"z-index": -1});
       
        $sd.mousemove(function( e ){console.log(1);
            e.preventDefault();
            e.stopPropagation();
            
            var dir = e.clientX - this.clientX > 0 ? "R" : "L",
                left = e.clientX + diff;
            if( left < max[0] || left > max[1] ) return;
            
            this.clientX = e.clientX;
            $sd.css({"left": left + "px"});
            console.log(threshold)
            var moved = false;
            if( moved = (dir === "R" && left > threshold[1]) ){
                $next.after( $me );
            }else if( moved = (dir === "L" && left < threshold[0]) ){
                $prev.before( $me );
            }
            if( moved ) init();
        });
       
        function fn( e ){
            e.stopPropagation();
            $me.css({"z-index": ""});
            $tabs.find("li.active").removeClass("active");
            $me.addClass("active");
            $sd.remove();
        }
        $sd.bind({
            "mouseleave": fn,
            "mouseup": fn
        });
    });
}

$.fn.tabs_undragable = function(){
    
}

})($)
