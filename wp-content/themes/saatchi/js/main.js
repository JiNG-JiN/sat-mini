$(document).ready(function(){
	if($(window).width()> 960){
		resizeWidth();
	}
	
	if($('html').hasClass('touch') && $(window).width()> 1300){
		$('.home-content .part4 .item').click(function(){
			$('.home-content .part4 .popup').fadeOut();
			$(this).next('.popup').fadeIn();
		})
		$('.home-content .part4 .popup').click(function(){
			$(this).fadeOut();
		})
		
	}
	if($('html').hasClass('no-touch')){
		$('.home-content .part4 .item').click(function(){
			$(this).next('.popup').fadeIn();
		})
		$('.home-content .part4 .popup').hover(function(){
			$(this).fadeIn();
		},function(){
			$(this).fadeOut();
		})
	}
	$('.part4-touch .item .title').click(function(){
		$('.part4-touch .title').removeClass('over');
		$('.part4-touch .popup').hide();
		$(this).addClass('over');
		$(this).next().show();
	})
	
	if($('html').hasClass('touch') && $(window).width()< 961){
		$('.part5 .item1').addClass('over');
		$('.part5 li dt').click(function(){
			$('.part5 li').removeClass('over');
			$('.part5 li dd,.part5 li a.more').hide();
			$(this).parents('li').addClass('over');
			$(this).siblings().show();
		})
		
		$('.footer-top dl dt').click(function(){
			$(this).toggleClass('over');
			$(this).siblings().toggle();
		})
	}
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
	
	
	$(window).resize(function(){
		if($(window).width()> 960){
			resizeWidth();
		}
	})
	
})
function resizeWidth(){
	var $width = $('.content-container').width()-22;
	$('.part5 li,.part6 .media-boxes article,.part7 li,.footer-top dl,.footer-top form').css('width',$width/3);
	$('.part6 .media-boxes article:last').css('margin-right',0);
}
