$(document).ready(function(){
	
	var $width = $('.content-container').width()-22;
	$('.part5 li,.part6 .media-boxes article,.part7 li,.footer-top dl,.footer-top form').css('width',$width/3);
	$('.part6 .media-boxes article:last').css('margin-right',0);
	
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
	
	$('.defaultText').on('click',function(){
		$(this).hide();
		$('.message').focus();
	})
	var $message;
	$('.message').on('focus',function(){
		$('.defaultText').hide();
	})
	$('.message').on('blur',function(){
		$message = $('.message').val();
		if($message==''){
			$('.defaultText').show();
		}
	})
	
	$('.footer-top dl dd.expanded').hover(function(){
		$(this).addClass('over');
		$(this).find('ul').show();
	},function(){
		$(this).removeClass('over');
		$(this).find('ul').hide();
	})
})