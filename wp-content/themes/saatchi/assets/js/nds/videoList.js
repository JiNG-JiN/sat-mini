var NDS = NDS || {};

NDS.videoList = (function(){

    var $yearToggle = $('.nds-year__select');
    var $yearToggleDropdown = $('.nds-year__dd');
    var $yearSelect = $('.nds-year__dd-item');

    var yearsTemplate = $('.nds-template').html();
    var $yearsContainer = $('.nds-years');
    var $directorContainer = $('.nds-director');
 
    var startingYear, currentYear, lowestYear;
    var loadedYears = [];
    var loading = false;
    var directorView = false;

    Array.prototype.max = function() {
      return Math.max.apply(null, this);
    };

    function toggleYear(e){
        e.preventDefault();
        $('.nds').removeClass('search-open').toggleClass('year-open');
        NDS.directorSearch.removeSearch();
    }

    function toggleLoading(){
        $('.nds__loading').toggleClass('show', loading);
    }
 
    function loadYear(e){

        if(typeof e === 'object') e.preventDefault();

        if(loading){
            return;
        }

        loading = true;
        toggleLoading();

        var yearId = (typeof arguments[0] !== 'string') ? $(arguments[0].target).attr('data-id') : arguments[0];

        $.getJSON(xhrUrl + yearId).done(displayYear);

    } 

    function displayYear(yearData){

        var posTop;
        var newYear = parseInt(yearData.year.title);

        // If current view is director empty results
        if(directorView){
            directorView = false;
            $yearsContainer.show();
            $directorContainer.hide();
            $('.nds__loading').show();
        }

        // Highlight active year
        yearData['show_nav'] = true;
        $yearSelect.find('a').removeClass('active');
        $yearToggleDropdown.find('*[data-id="'+yearData.year.id+'"]').addClass('active');

        if(currentYear === newYear && _.indexOf(loadedYears, newYear) > -1){
            // Scroll to year
            posTop = $('*[data-year="'+newYear+'"]').offset().top;       
        }
        else if(newYear === currentYear-1 || newYear == currentYear || loadedYears.length === 0){
            // Append to template
            posTop = (newYear===2015) ? 0 : undefined;
            $yearsContainer.append(_.template(yearsTemplate)(yearData));
        }
        else if(newYear > loadedYears.max()){
            $yearsContainer.prepend(_.template(yearsTemplate)(yearData));
        }
        else{
            var flag = false;
            for (var i = newYear; i <= startingYear; i++) {
                if(_.indexOf(loadedYears, i) > -1 && !flag){
                    var html = $('<div />').html(_.template(yearsTemplate)(yearData));
                    $(html).insertAfter($('*[data-year="'+i+'"]'));
                    flag = true;
                }
            };
        }
 
        currentYear = newYear;
        $('.nds__loading').toggle(currentYear-1>=lowestYear);
        loadedYears.push(currentYear);
        scrollToPosition(posTop);
        preloadImages();
        masonry();

    }

    function preloadImages(){

        NDS.lazyLoad({
            container: $('*[data-year="'+ (directorView ? '' : currentYear) +'"]'),
            selector: '.nds-year__video-inner'
        });
    }

    function masonry(){

        var $current = $('*[data-year="'+ (directorView ? '' : currentYear) +'"]');
        var wall = new freewall($current.find('.nds-year__videos'));
        var width = (window.innerWidth <= 768) ?  50 : ($current.outerWidth(true) / 4);

        wall.reset({
            selector: '.nds-year__video-item',
            animate: true,
            cellW: width,
            cellH: 'auto',
            gutterX: 15, 
            gutterY: 5,
            animate: false,
            onResize: function() {
                wall.fitWidth();
            }
        });

        wall.fitWidth();
    }

    function scrollToDirector(e){

        e.preventDefault();

        var videoId = $(this).attr('data-id');
        var video = $(this).parents('.nds-years__row').find('.nds-year__videos *[data-id="'+videoId+'"]');

        try{
            scrollToPosition(video.offset().top);
        }
        catch(e){
            // No element found
        }
    }

    function scrollToPosition(posTop){
 
        if(posTop !== 0){
            posTop = posTop || $('*[data-year="'+currentYear+'"]').offset().top;
            $('html, body').animate({'scrollTop': posTop - 100}, function(){
                loading = false;
                toggleLoading();
            });
        }
        else{
            loading = false;
            toggleLoading();
        }

    } 

    function loadNext(e){

        var _currentYear = Math.max(currentYear-1, lowestYear);

        if(e.type === 'click'){
            e.preventDefault();
        }

        if(
            ((_.indexOf(loadedYears, lowestYear) > -1 && _currentYear <= lowestYear) || directorView) ||
            (($(window).scrollTop() + $(window).height()) < $(document).height() - 100)
        ){
            return; 
        }

        $yearToggleDropdown.find(".nds-year__dd-item:contains('"+_currentYear+"') a").trigger('click');
    }

    function displayDirector(data){

        directorView = true;
        $('.nds__loading').hide();

        $yearsContainer.hide();
        $directorContainer.show().html(_.template(yearsTemplate)({
            boxes: data,
            show_nav: false
        })); 

        preloadImages();
        masonry();

    }

    function removeDirector(){

        directorView = false;
        $yearsContainer.show();
        $directorContainer.empty().hide();
        
    } 

    function init(){
    
        $yearToggle.on('click', toggleYear);
        $yearSelect.find('a').on('click', loadYear);
        $('body').delegate('.nds-year__directors-item a', "click", scrollToDirector);
        
        // Force scroll top        
        $('html, body').scrollTop(0);
        $(window).scrollTop(0).on('scroll', loadNext);
        $('.nds__loading a').on('click', loadNext);

        startingYear = currentYear = parseInt(yearData.year.title);
        lowestYear = $yearToggleDropdown.find('.nds-year__dd-item:last').text()*1 || 1991;

        displayYear(yearData);

        if(location.hash){
            $yearToggleDropdown.find(".nds-year__dd-item:contains('"+location.hash.split('#')[1]+"') a").trigger('click');
        }
       
    }

    return { 
        init: init,
        displayDirector: displayDirector,
        removeDirector: removeDirector
    }

})();
