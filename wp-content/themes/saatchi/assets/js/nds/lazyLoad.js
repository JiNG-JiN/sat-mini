var NDS = NDS || {};

NDS.lazyLoad = (function(){

    return function(options){

        // Extend jquery selector to add inview test
        $.extend($.expr[':'], {
            inview: function ( el ) {

                var $e = $( el ),
                    $w = $( window ),
                    wt = $w.scrollTop(),
                    wb = wt + $w.height(),
                    et = $e.offset().top,
                    eb = et + $e.height();
         
                return eb >= wt && et <= wb;
            }
        });


        function scroll(){

            $(options.container).find(options.selector + ':inview').each(function(){

                var self = this;
                var img = new Image();

                img.src = $(this).attr('data-img');

                if($('html').hasClass('oldie')){
                    img.src += '?=' + Math.random() * 10000;
                }

     
                img.onload = function(){
                    $(self).css({'background-image': 'url('+img.src+')'})
                    $(self).parents('.nds-year__video-item').addClass('loaded');
                }

            });
        }

        $(window).on('scroll', scroll).trigger('scroll');

    }

})();