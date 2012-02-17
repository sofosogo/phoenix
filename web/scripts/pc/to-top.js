(function(){

var opacity = 0,
    $win = $(window),
    isIE6 = $.browser.msie && $.browser.version === "6.0",
    $totop;
$win.scroll(function(){
    var scrollTop = $win.scrollTop();
    if( scrollTop > 20 && opacity === 0 ){
        opacity = 1;
        getToTop().fadeIn("normal");
    }else if( scrollTop <= 20 && opacity === 1 ){
        opacity = 0;
        getToTop().fadeOut("normal");
    }
    if( isIE6 && $totop ){
        $totop.css({position: "absolute", top: (scrollTop + $win.height() - 200)+"px"});
    }
});
if( isIE6 ){
    $win.resize(function(){
        if( $totop ){
            $totop.css({position: "absolute", top: ($win.scrollTop() + $win.height() - 200)+"px"});
        }
    });
}

function getToTop(){
    if( !$totop ){
        $totop = $(default_html).appendTo( $("body") );
        $totop.click(function(){
            window.scrollTo(0, 0);
        });
    }
    return $totop;
}

var default_html = '<div class="to-top">↑回到顶部</div>';
})();
