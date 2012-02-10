(function(){

var opacity = 0,
    $totop;
$(window).scroll(function(){console.log(window.scrollY)
    if( window.scrollY > 20 && opacity === 0 ){
        opacity = 1;
        getToTop().fadeIn("normal");
    }else if( window.scrollY <= 20 && opacity === 1 ){
        opacity = 0;
        getToTop().fadeOut("normal");
    }
});

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
