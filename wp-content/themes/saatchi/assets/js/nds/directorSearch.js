var NDS = NDS || {};

NDS.directorSearch = (function(){

    var $input = $('.nds-search__box');
    var $results = $('.nds-search__results');
    var resultsTemplate = $('.nds-results-template').html();
    var selectPos = 0;

    function search(e){

        if(e.keyCode === 40 || e.keyCode === 38){
            selectDirector(e.keyCode===40);
            return;
        }

        if(selectPos > 0 && e.keyCode === 13){
            toggleResults(false);
            return;
        }

        selectPos = 0;
        var searchTerm = $(e.target).addClass('focus').val();

        var results = [];

        $(e.target).toggleClass('remove-search', (searchTerm !== "")); 

        _.each(directors, function(director){
            if(director.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 && results.length <= 2) results.push(director)
        });
 
        if(searchTerm === "" || !results){ 
            $(e.target).removeClass('focus');
            toggleResults(false);
            return;
        }
   
        toggleResults(true);
        showResults(results);

    }

    function selectDirector(dirUp){

        selectPos = Math.max(Math.min((!dirUp ? (selectPos-1) : selectPos+1), 3), 0);

        if(selectPos < 1){
            $input.val('');
            $('.nds-search__results').empty();
            NDS.videoList.removeDirector();
            return;
        }

        var $dir = $results.find('li').eq(selectPos-1);
        $input.val($dir.text());
        $dir.click();
    }   

    function showResults(results){

        $results.html(_.template(resultsTemplate)({results: results}));

    } 

    function toggleResults(show){
        $('.nds').toggleClass('search-open', show);
    }  

    function loadDirector(e){

        e.preventDefault();

        var director = $(this).text();    

         $input.val(director);

        $.post(xhrUrl, { director: director }, displayDirector);

    }

    function displayDirector(director){

        NDS.videoList.displayDirector(director);

    }

    function focus(e){
        
        selectPos = 0;

        if(e.type === 'blur'){
            $(this).attr('placeholder', 'SEARCH DIRECTORS');
            setTimeout(function(){ toggleResults(false); }, 200);
        }
        else{
            search(e); 
            $('.nds').removeClass('year-open');
            $(this).attr('placeholder', '');
        }
    }

    function removeSearch(e){ 

        if(typeof e === 'undefined' || e.offsetX >= $(e.target).width() - 30){
            $input.removeClass('focus remove-search').val('').trigger('blur');
            NDS.videoList.removeDirector();
        }

    }
 
    function init(){
    
        $input.on('keyup', search).on('focus blur', focus);
        $('body').delegate('.nds-search__results li', 'click', loadDirector);
        $('body').delegate('.remove-search', 'click', removeSearch);

    }

    return {
        init: init,
        removeSearch: removeSearch
    }

})();