$(document).ready(function(){
	/* sub-nav */
	var subnav = $('.site-nav li.menu-item-has-children').find('.sub-nav');
    if(subnav) {
        subnav.insertAfter(".site-nav");
    } 
	if($('.site-nav li.menu-item-has-children').hasClass('active') || $('.site-nav li.menu-item-has-children').hasClass('current-menu-parent')){
		subnav.show();
	}
	
	/* responsive resize */
	if($(window).width()> 960){
		resizeWidth();
	}
	
	/* part4 effect(touch)*/
	
	if($('html').hasClass('touch') && $(window).width()> 1300){
		$('.home-content .part4 .item').click(function(){
			$('.home-content .part4 .popup').fadeOut();
			$(this).next('.popup').fadeIn();
		})
		$('.home-content .part4 .popup').click(function(){
			$(this).fadeOut();
		})
		
	}
	
	/* part4 effect(no-touch)*/
	
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
	
	/*part5 effect(touch) window-width less than 961px*/
	
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
	
	/*form textarea placeholder*/
	
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

	/*footer menu*/
	
	$('.footer-top dl dd.expanded').hover(function(){
		$(this).addClass('over');
		$(this).find('ul').show();
	},function(){
		$(this).removeClass('over');
		$(this).find('ul').hide();
	})
	
	/*window resize*/
	
	$(window).resize(function(){
		if($(window).width()> 960){
			resizeWidth();
		}
	})
	
})
function resizeWidth(){
	var $width = $('.content-container').width()-22;
	var $width2 = $('.footer-top .full-width').width()-22;
	$('.part5 li,.part6 .media-boxes article,.part7 li').css('width',$width/3);
	$('.footer-top dl,.footer-top form').css('width',$width2/3);
	$('.part6 .media-boxes article:last').css('margin-right',0);
}
