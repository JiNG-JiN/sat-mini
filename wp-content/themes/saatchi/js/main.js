$(document).ready(function(){
	$('.home-content .part4 .item').click(function(){
		$('.home-content .part4 .popup').fadeOut();
		$(this).next('.popup').fadeIn();
	})
	
	$('.home-content .part4 .popup').click(function(){
		$(this).fadeOut();
	})
	
	$('.part6 .media-boxes article').click(function(){
		var $url = $(this).attr('data-url');
		console.log($url);
		window.location.href = $url;
	})
})