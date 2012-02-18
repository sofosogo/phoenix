(function(){

var opacity = 0,
    bodyWidth = $("article").width(),
    myWidth,
    $win = $(window),
    isIE6 = $.browser.msie && $.browser.version === "6.0",
    $totop;
$win.scroll(function(){
    var scrollTop = $win.scrollTop();
    $totop = getToTop();
    if( scrollTop > 20 && opacity === 0 ){
        opacity = 1;
        $totop.fadeIn("normal");
    }else if( scrollTop <= 20 && opacity === 1 ){
        opacity = 0;
        $totop.fadeOut("normal");
    }
    if( isIE6 && $totop ){
        $totop.css({position: "absolute", top: (scrollTop + $win.height() - 200)+"px"});
    }
});

$win.resize(function(){
    $totop = getToTop();
    var right = Math.max(($win.width()-bodyWidth)/2-myWidth, 0) + "px";
    if( isIE6 ){
        var top = parseInt($win.scrollTop() + $win.height() - 200)+"px";
        $totop.css({position: "absolute", top: top, right: right});
    }else{
        $totop.css({right: right});
    }
});


function getToTop(){
    if( !$totop ){
        $totop = $(default_html).appendTo( $("body") );
        $totop.click(function(){
            window.scrollTo(0, 0);
        });
        myWidth = $totop.width();
        $win.resize();
    }
    return $totop;
}

var default_html = '<div class="to-top">↑回到顶部</div>';
})();
