var NDS = NDS || {};

NDS.videoPopup = (function(){ 

    var KEYCODE_ESC = 27;
    var popupTemplate = _.template($('.popup-template').html());

    function isVimeo(n){
        return n >>> 0 === parseFloat(n);
    }
 
    function showVideo(){

        var videoUrl = $(this).attr('data-video');

        if(videoUrl == '0'){
            // Not a valid video - do nothing!!
            return;
        }
        else if(!isVimeo(videoUrl)){
            videoUrl = 'https://www.youtube.com/embed/' + videoUrl + '?autoplay=1&enablejsapi=1&origin=' + window.Site.basePath + '&autohide=1&modestbranding=1&rel=0&showinfo=0';
        }
        else{
            videoUrl = 'http://player.vimeo.com/video/' + videoUrl + '?title=0&byline=0&portrait=0&autoplay=1';
        }

        $('body').append(popupTemplate({url: videoUrl}));

    }

    function closeVideo(e){
        e.preventDefault();
        $(this).remove();
    }

    function init(){
        $('body').delegate('.nds-year__video-item', 'click', showVideo);
        $('body').delegate('.nds-popup', 'click', closeVideo);
        $(document).on('keyup', function(e){
          if (e.keyCode == KEYCODE_ESC) closeVideo.call($('.nds-popup'));
        });
    }

    return {
        init: init
    }
    
})();  