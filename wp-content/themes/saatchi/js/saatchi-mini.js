( function( $ ) {
    var subnav = $('nav.sub-nav').get(0);
    console.log(subnav);
    if(subnav) {
        $(subnav).insertAfter(".site-nav");
    }
} )( jQuery );
