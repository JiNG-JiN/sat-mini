var NDS = NDS || {};

NDS.stickyNav = (function(){

    // This is a direct copy of the sticky nav, in script. js with Backbone dependency removed for speed on this
 
    var $page = $('.site-content');
    var $header = $('.fixed-header');
    var flag = false;
    var offset, scrollTop;

    function onScroll(){

        scrollTop = $(window).scrollTop();
        var fixNav = (scrollTop >= offset);

        $page.attr({ 'css': (fixNav) ? 'padding-top:130px' : '' });
        $header.toggleClass('fixed', fixNav);

    }

    function toggleMenu(e){
        e.preventDefault();
        $('.site-nav').toggleClass('open');
    }

    function init(){
    
        offset = $header.offset().top;
        $(window).on('scroll', onScroll);
        $('a.handle').on('click', toggleMenu);

    } 

    return {
        init: init
    }

})();