(function(Site){
	// Variables for laters
	var Model = Backbone.Model,
			View = Backbone.View,
			PeopleList, HeroSlideshow, MediaBoxes, MediaBox, FixedHeader, SiteContent, Map, SocialButtons,
			SiteNav, App, app, Router;

	// View for the sub-navigation
	FixedHeader = View.extend({
		el: '.fixed-header',
		initialize: function() {
			this.flag = false;
			this.offset = this.$el.offset().top;
			this.onScroll();

			$(window).on('scroll', _.bind(this.onScroll, this));

		},  

		onScroll: function() {
			var scrollTop = $(window).scrollTop();
			if ( scrollTop >= this.offset ) {
				this.$el.addClass('fixed');
				$('.site-content').css({'padding-top': 130 })
			} else {
				$('.site-content').attr('style', '');
				this.$el.removeClass('fixed');
			}

		}
	});

	// Any big slideshows at the top of a page
	HeroSlideshow = View.extend({
		events: {
			'click nav a': 'clickHandler',
			'click .banner a': 'clickHandler',
			'click .banner': 'clickHandler',
			'click .prev': 'clickHandler',
			'click .next': 'clickHandler'
		},
		initialize: function() {
			var _this = this,
					$el;

			this.type = this.$el.hasClass('work') ? 'work' : 'homepage';

			this.slides = [];
			this.$slides = this.$('> .slide');
			this.$slides.each(function() {
				$el = $(this);
				_this.slides.push(new HeroSlide({ el: $el }));
			});


			this.$videoOverlay = $('<div class="overlay"><div class="content"></div></div>').appendTo($('body'));
			this.$videoContainer = $('<div class="video-frame"><a href="#" class="close-overlay">Close</a></div>').appendTo(this.$videoOverlay.find('.content'));
			this.$videoContainer.find('.close-overlay').on('click', _.bind(this.closeVideo, this));

			this.currentSlide = 0;
			this.slidesCount = this.slides.length;
			if ( this.slidesCount > 1 ) this.buildNav();
			this.goTo(0);
			if ( this.slidesCount > 1 && this.type === 'homepage' ) this.cycle();
			if (this.slidesCount > 1 && this.type === 'work') {
				this.$el.swipe({
					click:null,
					swipeLeft:function() {
						_this.goTo(_this.currentSlide+1)
					},
					swipeRight:function() {
						_this.goTo(_this.currentSlide-1)
					},
					allowPageScroll:'auto'
				});
			}

		},
		buildNav: function() {
			var html = '';
			this.$nav = $('<nav class="full-width">');
			this.$prev = $('<a href="#prev" class="prev">');
			this.$next = $('<a href="#next" class="next">');

			html += '<ul class="cf">';
			for ( var i = 0; i < this.slidesCount; i++ ) html += '<li><a href="#' + i + '"><span>' + (i+1) + '</span></a></li>';
			html += '</ul>';

			this.$nav.html(html);
			this.$nav.appendTo(this.$el);
			this.$prev.appendTo(this.$el);
			this.$next.appendTo(this.$el);
		},
		updateNav: function(i) {
			var self = this;
			if ( this.$nav ) {
				setTimeout(function(){
					self.$nav.find('a').removeClass('active');
					self.$nav.find('a').eq(i).addClass('active');
				}, 10);
			}
		},
		goTo: function(i) {
			if ( i > this.slidesCount-1 ) i = 0;
			if ( i < 0 ) i = this.slidesCount-1;

			var $slide = this.$slides.eq(i),
					zIndex;

			this.zIndex = this.zIndex + 1;

			this.$slides.removeClass('active left right');
			$slide.css({ zIndex: this.zIndex }).addClass('active');
			$slide.prevAll('.slide').addClass('left');
			$slide.nextAll('.slide').addClass('right');

			if ( i === 0 ) {
				zIndex = this.slidesCount;
				this.zIndex = zIndex+1;
				this.$slides.each(function() {
					$(this).css({ 'z-index': zIndex });
					zIndex--;
				});
			}

			if (this.type === 'work') this.collapse();
			this.currentSlide = i;
			this.updateNav(i);
		},
		clickHandler: function(evt) {
			var $target = $(evt.currentTarget),
					href = $target.attr('href');

			if ( href ) {

				href = href.replace(/#/, '');

				this.pause();

				if ( href >= 0 ) {
					this.goTo(href);
				} else if ( href === 'next' ) {
					this.goTo(this.currentSlide+1);
				} else if ( href === 'prev' ) {
					this.goTo(this.currentSlide-1);
				} else if ( href === 'play-video' ) {
					this.openVideo($target.data('video-type'), $target.data('video-id'));
				} else {
					window.location = href;
				}

			} else {

				this.goTo(this.currentSlide+1);

			}

			return false;
		},
		cycle: function() {
			var _this = this;
			if ( this.interval ) clearInterval(this.interval);
			this.interval = setInterval(function() { _this.goTo(_this.currentSlide+1); }, 6000);
		},
		pause: function() {
			if ( this.interval ) clearInterval(this.interval);
		},
		expand: function() {
			var newHeight = this.$('.active .page').outerHeight(true);
			this.pause();
			this.$el.css({ marginBottom: newHeight });
			$('.slideshow-mask').addClass('inactive');
			this.slides[this.currentSlide].$('.media-slideshow').find('img').each(function() {
				$(this).attr('src', $(this).data('src'));
			});
		},
		collapse: function() {
			this.cycle();
			this.$el.removeAttr('style');
			$('.slideshow-mask').removeClass('inactive');
		},
		openVideo: function(videoType, videoId) {
			var html, url;
			this.pause();
/*
			if ( videoType === 'vimeo' ) {
				url = 'http://player.vimeo.com/video/' + videoId + '?title=0&byline=0&portrait=0&autoplay=1';
			} else if ( videoType === 'youtube' ) {
				url = 'http://www.youtube.com/embed/' + videoId + '?autoplay=1&origin=' + Site.basePath + '&autohide=1&modestbranding=1&rel=0&showinfo=0';
			}
			html = '<iframe type="text/html" width="800" height="450" src="' + url + '" frameborder="0"></iframe>';

*/
			html = '<video src="/uploads/videos/' + videoId +'" width="800" height="450" controls preload></video>';
			this.$videoContainer.append(html);
			this.$videoOverlay.addClass('active');
		},
		closeVideo: function() {
			var _this = this;
			this.cycle();
			this.$videoOverlay.removeClass('active');
			setTimeout(function() {
				_this.$videoContainer.find('iframe').remove();
			}, 300);
		}
	});

	// Slide for the HeroSlideshow views
	HeroSlide = View.extend({
		initialize: function() {
			this.$img = this.$('img');
			this.images = {
				large: {
					width: 1800,
					height: 500,
					src: this.$img.data('large')
				},
				medium: {
					width: 1350,
					height: 430,
					src: this.$img.data('medium')
				},
				small: {
					width: 760,
					height: 350,
					src: this.$img.data('small')
				}
			}
			this.startHeight = $(window).height();
			this.startWidth = $(window).width();

			this.imageSize();

			$(window).on('resize', _.bind(this.onWindowResize, this));
		},
		render: function(size) {
			var temp = new Image();
			temp.onload = _.bind(function() { this.$img[0].src = this.images[this.currentImage].src; }, this);
			temp.src = this.images[size].src;
			this.currentImage = size;
		},
		onWindowResize: function() {
			if($(window).width() !== this.startWidth) {
				this.imageSize();
				this.startWidth = $(window).width();
			} else {
				return false
			}      
		},
		imageSize: function() {
			var windowWidth = $(window).width(),
					size;
			if ( windowWidth >= 1350 ) {
				size = 'large';
			} else if ( windowWidth < 1350 && windowWidth >= 760 ) {
				size = 'medium';
			} else {
				size = 'small';
			}
			if ( size !== this.currentImage ) this.render(size);
		}
	});

	// Any small slideshows
	MediaSlideshow = View.extend({
		events: {
			'click nav a': 'clickHandler',
			'click .slide a': 'clickHandler'
		},
		initialize: function() {
			var _this = this,
					$el;

			this.slides = [];
			this.$slides = this.$('> .slide');
			this.$slides.each(function() {
				$el = $(this);
				_this.slides.push(new Slide({ el: $el }));
			});

			this.currentSlide = 0;
			this.slidesCount = this.slides.length;
			if ( this.slidesCount > 1 ) this.buildNav();
			this.goTo(0);
		},
		buildNav: function() {
			var html = '';
			this.$nav = $('<nav>');

			html += '<ul class="cf">';
			for ( var i = 0; i < this.slidesCount; i++ ) html += '<li><a href="#' + i + '">' + (i+1) + '</a></li>';
			html += '</ul>';

			this.$nav.html(html);
			this.$nav.appendTo(this.$el);
		},
		updateNav: function(i) {
			if ( this.$nav ) {
				this.$nav.find('a').removeClass('active');
				this.$nav.find('a').eq(i).addClass('active');
			}
		},
		goTo: function(i) {
			if ( i > this.slidesCount-1 ) i = 0;
			if ( i < 0 ) i = this.slidesCount-1;

			this.closeVideo();

			var $slide = this.$slides.eq(i),
					zIndex;

			this.$slides.removeClass('active left right');
			$slide.css({ zIndex: this.zIndex++ }).addClass('active');
			$slide.prevAll('.slide').addClass('left');
			$slide.nextAll('.slide').addClass('right');

			if ( i === 0 ) {
				zIndex = this.slidesCount;
				this.zIndex = zIndex+1;
				this.$slides.each(function() {
					$(this).css({ 'z-index': zIndex });
					zIndex--;
				});
			}

			this.currentSlide = i;
			this.updateNav(i);
		},
		clickHandler: function(evt) {0

			var $a = $(evt.currentTarget),
					href = $a.attr('href').replace(/#/, '');

			if ( href >= 0 ) {
				this.goTo(href);
				return false;
			} else if ( href === 'next' ) {
				this.goTo(this.currentSlide+1);
				return false;
			} else if ( href === 'prev' ) {
				this.goTo(this.currentSlide-1);
				return false;
			} else if ( href === 'play-video' ) {
				this.openVideo($a.data('video-type'), $a.data('video-id'));
				return false;
			}
		},
		openVideo: function(videoType, videoId) {
			var html, url;
/*
			if ( videoType === 'vimeo' ) {
				url = 'http://player.vimeo.com/video/' + videoId + '?title=0&byline=0&portrait=0&autoplay=1';
			} else if ( videoType === 'youtube' ) {
				url = 'http://www.youtube.com/embed/' + videoId + '?autoplay=1&origin=' + Site.basePath + '&html5=1&autohide=1&modestbranding=1&rel=0&showinfo=0';
			}
			html = '<iframe type="text/html" width="800" height="450" src="' + url + '" frameborder="0"></iframe>';
*/
			html = '<video src="/uploads/videos/' + videoId +'" width="800" height="450" controls preload></video>';
			this.slides[this.currentSlide].$el.append(html);
		},
		closeVideo: function() {
			if (this.slides[this.currentSlide]) this.slides[this.currentSlide].$('video').remove();
		}
	});

	// Slide for the MediaSlideshow views
	Slide = View.extend({
		initialize: function() {
			this.$img = this.$('img');
			this.render();
		},
		render: function() {
			var _this = this;
			if ( ! this.loaded ) setTimeout(function() { _this.$el.imagesLoaded(_this.showImage()); }, 100);
		},
		showImage: function() {
			this.$('img').addClass('loaded');
			this.loaded = true;
		}
	});

  // Wrapper-view for the thumbnails everywhere
  MediaBoxes = View.extend({
 
    el: '.media-boxes',
    events: {
      'click .pagination .next a': 'loadNext',
    },
    initialize: function() {
      var _this = this,
          $el;

			// var $videoOverlay = $('<div class="overlay"><div class="content"></div></div>').appendTo($('body'));
			// $('<div class="video-frame"><a href="#" class="close-overlay">Close</a></div>').appendTo($videoOverlay.find('.content'));

			this.boxes = [];
			this.$('.media-box').each(function() {
				$el = $(this);
					_this.boxes.push(new MediaBox({ el: $el }));
			});


			this.loadedMoreCount = 0;
			this.$nextLink = this.$('.pagination .next a');
			if ( this.$nextLink.length > 0 ) {
				this.onScroll();
				$(window).on('scroll', _.bind(this.onScroll, this));
			}

			this.startHeight = $(window).height();
			this.startWidth = $(window).width();

			this.onResize();
			$(window).on('resize', _.bind(this.resizeBuffer, this));
	},
	onScroll: function() {

		autoScrollLimit = 3;
		if ( this.loadedMoreCount >= autoScrollLimit) {
			$(window).off('scroll', _.bind(this.onScroll, this));
		} else if ( this.$nextLink.length > 0 && $(window).scrollTop() + $(window).height() + 200 > this.$nextLink.offset().top ) {
			this.loadNext();
		}
	},
	resizeBuffer: function() {
		clearTimeout(this.resizeTimeout);
		this.resizeTimeout = setTimeout(_.bind(this.onResize, this), 200);
	},
	onResize: function() {
		//if($(window).width() !== this.startWidth) {
			var containerWidth = this.$el.outerWidth(false),
					boxesCount = this.boxes.length,
					layout = [],
					rowWidths = [],
					row = [],
					rowWidth = 0,
					offsetY = 0,
					i, j, box, boxWidth, extraSpace, portion;

			// Added for directors showcase to avoid stretching the image
			if(this.$el.hasClass('directors_showcase') && boxesCount === 1 && $(window).outerWidth(false) >= 768){
				containerWidth = containerWidth / 3;
			}

			for ( i = 0; i < boxesCount; i++ ) {
				box = this.boxes[i];
				box.$el.removeAttr('style');
				if ( box.$el.position().top > offsetY ) {
					layout.push(row);
					rowWidths.push(rowWidth);
					row = [];
					rowWidth = 0;
					offsetY = box.$el.position().top;
				}
				row.push(box); 
				rowWidth += box.$el.outerWidth(true);
				if ( i === boxesCount-1 ) {
					layout.push(row);
					rowWidths.push(rowWidth);
				}
			}

			for ( i = 0; i <= rowWidths.length-1; i++ ) {
				if ( rowWidths[i] < containerWidth ) {
					extraSpace = containerWidth - rowWidths[i];
					for ( j = 0; j < layout[i].length; j++ ) {
						boxWidth = box.$el.outerWidth(true);
						portion = Math.floor(extraSpace/(layout[i].length-j));
						extraSpace -= portion;
						box = layout[i][j];

						

						box.$el.css({ width: '+=' + portion });
					}
				}
			}

			for ( i = 0; i < this.boxes.length; i++ ) {
				this.boxes[i].render();
			}
			this.startWidth = $(window).width();
		//} else {
			//return false
		//}
	},
	loadNext: function() {
		if ( this.loading ) return false;

		var _this = this,
				nextUrl = this.$nextLink.attr('href'),
				$container = $('<div>');

		this.loadedMoreCount++;
		this.loading = true;
		this.$nextLink.parents('.pagination').remove();

		$container.load(nextUrl + ' .media-boxes', function() {

			var $newItems = $container.find('.media-box'),
			newItemsCount = $newItems.length;
			
			$newItems.each(function(i) {
				$el = $(this);
				_this.$el.append($el);
				_this.boxes.push(new MediaBox({ el: $el }));

				if ( i === newItemsCount - 1 ) {
					$container.find('.pagination').appendTo(_this.$el);
					_this.$nextLink = _this.$('.pagination .next a');
					_this.loading = false;         
					_this.onScroll();
					_this.onResize();
				}

			});
		});

		return false;
		}
	});

	// View for a thumbnail
	MediaBox = View.extend({
		events: {
			'click': 'onClick'
		},
		initialize: function() {
			this.url = this.$el.data('url');
			this.$frame = this.$('.image-frame');
			this.$img = this.$frame.find('img');
			this.$header = this.$el.find('header');
			this.imgWidth = this.$img.attr('width');
			this.imgHeight = this.$img.attr('height');

			/* Add popup */
			this.$videoOverlay = $('.overlay');
			this.$videoContainer = $('.video-frame');
			this.$videoContainer.find('.close-overlay').on('click', _.bind(this.closeVideo, this));

			this.render();
			if ( ! this.$el.hasClass('social') ) this.$('header h2').dotdotdot({ watch: 'window', tolerance: 2 });
		},
		render: function() {
			this.centerImage();
			if ( ! this.visible ) {
				this.$el.addClass('show');
				this.visible = true;
			}
		},
		navToUrl: function(e) {

			var clickedElement = ($(e.target).parent().find('.play-video').length === 0) ? $(e.target) : $(e.target).parent().find('.play-video');

			if (this.$el.hasClass('no_link') || !this.url){
				return false;
			}

			if (clickedElement.is('img') && clickedElement.hasClass('loaded') && clickedElement.data('video-type')) {
				this.openVideo(clickedElement.next().data('video-type'), clickedElement.next().data('video-id'));
			} else if (clickedElement.hasClass('play-video')) {
				this.openVideo(clickedElement.data('video-type'), clickedElement.data('video-id'));
			}

			if ( !clickedElement.hasClass('share')) {
				if ( this.$el.hasClass('social') ) {
					window.open(this.url);
				} else if(typeof this.url !== 'undefined') {
					window.location.href = this.url;
				}
				return false;
			}
		},
		onClick: function(evt) {
			if(this.$el.parents('html').hasClass('touch') && ! this.$el.hasClass('social') && ! this.$el.hasClass('media-box--showcase') ){
				evt.preventDefault();
				if( ! this.$el.hasClass('expanded')) {
					this.$el
						.addClass('expanded')
					} else {
						this.$el.removeClass('expanded');
						this.navToUrl(evt);
					}
				
			} else {
				this.navToUrl(evt);
			}
			
		},
		centerImage: function() {
			var frameHeight = this.$frame.outerHeight(false),
					frameWidth = this.$frame.outerWidth(false),
					newImgHeight = this.imgHeight,
					newImgWidth = this.imgWidth,
					topOffset, leftOffset;
			if ( newImgWidth < frameWidth ) {
				newImgWidth = frameWidth;
				newImgHeight = this.imgHeight / this.imgWidth * newImgWidth;
			}
			topOffset = ( frameHeight - newImgHeight ) / 2;
			leftOffset = ( frameWidth - newImgWidth ) / 2;
			this.$img.css({ width: newImgWidth, height: newImgHeight, marginLeft: leftOffset, marginTop: topOffset });
		},
		openVideo: function(videoType, videoId) {
			var html, url;
			if ( videoType === 'vimeo' ) {
				url = 'http://player.vimeo.com/video/' + videoId + '?title=0&byline=0&portrait=0&autoplay=1';
			} else if ( videoType === 'youtube' ) {
				url = 'http://www.youtube.com/embed/' + videoId + '?autoplay=1&origin=' + Site.basePath + '&autohide=1&modestbranding=1&rel=0&showinfo=0';
			}
			html = '<iframe type="text/html" width="800" height="450" src="' + url + '" frameborder="0"></iframe>';
			this.$videoContainer.append(html);
			this.$videoOverlay.addClass('active');
		},
		closeVideo: function(e) {
			var _this = this;

			e.preventDefault();
			this.$videoOverlay.removeClass('active');
			setTimeout(function() {
				_this.$videoContainer.find('iframe').remove();
			}, 300);
		}
	});

	// View for the people list
	PeopleList = View.extend({
		events: {
			'click .filters': 'clickFilters'
		},
		initialize: function() {
			var navHeight = $(".sub-nav").height() + 210;
			if(window.location.hash === '#detail') {
				window.onload = function(){
					$('html,body').animate({scrollTop: $(".detail").offset().top - navHeight},'slow')
				};
			}
		},
		clickFilters: function(evt) {
			var $filter = $(evt.target),
					$filterDropdown = $(evt.currentTarget);
			if ( $filterDropdown.hasClass('open') ) {
				this.filterPeople($filter.data('filter'));
				$filter.addClass('active').siblings('.filter').removeClass('active');
				$filterDropdown.removeClass('open');
			} else {
				$filterDropdown.addClass('open');
			}
			return false;
		},
		filterPeople: function(filter) {
			if ( filter === 'all' ) {
				this.$('.people .person').removeClass('blur');
			} else {
				this.$('.people .person').addClass('blur');
				this.$('.people .person.' + filter).removeClass('blur');
			}
		}
	});

	// View for the map
	MapView = View.extend({
		el: '.map',
		iconUrl: Site.basePath+'/assets/image/',
		initialize: function() {
			google.maps.Map.prototype.setCenterWithOffset= function(latlng, offsetX, offsetY) {
				var map = this;
				var ov = new google.maps.OverlayView();
				ov.onAdd = function() {
					var proj = this.getProjection();
					var aPoint = proj.fromLatLngToContainerPixel(latlng);
					aPoint.x = aPoint.x+offsetX;
					aPoint.y = aPoint.y+offsetY;
					map.setCenter(proj.fromContainerPixelToLatLng(aPoint));
				};
				ov.draw = function() {};
				ov.setMap(this);
			};

			this.map = false;
			this.marker = [];
			this.offset = { x: 0, y: 0 };
			this.render();
		},
		render: function() {
			this.center = new google.maps.LatLng(this.$el.data('start-lat'), this.$el.data('start-lng'));
			this.mapOpts = {
				center: this.center,
				zoom: 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: false,
				panControl: true,
				panControlOptions: {
						position: google.maps.ControlPosition.TOP_RIGHT
				},
				zoomControl: true,
				zoomControlOptions: {
						style: google.maps.ZoomControlStyle.LARGE,
						position: google.maps.ControlPosition.TOP_RIGHT
				},
				scaleControl: false,
				streetViewControl: false
			};
			this.map = new google.maps.Map(this.$el[0], this.mapOpts);
			this.marker = new google.maps.Marker({
				position: this.center,
				map: this.map,
				title: this.$el.data('start-office'),
				icon: this.iconUrl+'map-pin.png'
			});
		},
		recenterMap: function() {
			this.map.setCenterWithOffset(this.center, this.offset.x, this.offset.y);
		},
		selectOffice: function(lat, lng, office) {
			this.center = new google.maps.LatLng(lat, lng);
			this.marker.setMap(null);
			this.marker = new google.maps.Marker({
				position: this.center,
				map: this.map,
				title: office,
				icon: this.iconUrl+'map-pin.png'
			});
			this.recenterMap();
		}
	});

	// View for the offices page
	Offices = View.extend({
		events: {
			'click .region h1.handle': 'regionToggleClickHandler',
			'click .office a.handle': 'officeOpenClickHandler',
			'click .office-data a.close': 'officeCloseClickHandler'
		},
		initialize: function() {
			this.mapView = new MapView({ parentView: this });

			this.$officesList = this.$('.primary-content');

			this.onResize();
			//$(window).on('resize', _.bind(this.onResize, this));
		},
		onResize: function(evt) {
			var height = $(window).height() - $('.site-header').outerHeight() - $('.site-footer').outerHeight(),
					offsetLeft = $('hgroup.logo').offset().left;
			this.$el.css({ height: height });
			this.$officesList.css({ left: offsetLeft });
			this.mapView.offset.x = (offsetLeft + this.$officesList.outerWidth(false)) * -1 / 2;
			this.mapView.offset.y = $('.site-header').outerHeight() / 2;
			this.mapView.recenterMap();
		},
		regionToggleClickHandler: function(evt) {
			
			var $a = $(evt.currentTarget),
					$region = $a.parents('.region');
			if ( $region.hasClass('open') ) {
				$region.removeClass('open');
			} else {
				$region.addClass('open')
					.siblings('.region').removeClass('open');
			}
			return false;
		},
		officeOpenClickHandler: function(evt) {
			var $a = $(evt.currentTarget),
					$office = $a.parents('.office'),
					$officeData = $office.find('.office-data');
			$('.office').removeClass('open');
			$office.addClass('open');
			this.mapView.selectOffice($officeData.data('lat'), $officeData.data('lng'), $officeData.data('office'));
			return false;
		},
		officeCloseClickHandler: function(evt) {
			var $a = $(evt.currentTarget);
			$a.parents('.office').removeClass('open');
			return false;
		}
	});

	// View for the careers page
	Careers = View.extend({
		events: {
			'click h1.handle': 'careerToggleClickHandler',
			'click .tabs li a': 'clickTab',
			'click .career-search-form .dropdown a': 'jobFilter'
		},
		initialize: function() {
			this.$careersList = this.$('.primary-content');
			$('.upload-btn').on('change', function () {
				var inputVal = this.value;
				inputVal = inputVal.slice(12);
				$(this).siblings('.upload-input').val(inputVal);
			});
		},
		careerToggleClickHandler: function(evt) {
			var $a = $(evt.currentTarget),
					$region = $a.parents('.dropdown');
			if ( $region.hasClass('open') ) {
				$region.removeClass('open');
			} else {
				$region.addClass('open')
					.siblings('.dropdown').removeClass('open');
			}
			return false;
		},
		clickTab: function(evt, section) {
			
			var _this = this,
					tabId = $(evt.currentTarget).attr('href'),
					$section = _this.$(tabId),
					$parent = $(evt.currentTarget).parent();

			$parent.addClass('active')
				.siblings().removeClass('active');
			$section.addClass('active').show()
				.siblings('.changeable-content').hide().removeClass('active');
			// $('html,body').animate({ scrollTop: $section.offset().top }, 'slow');
			return false;
		},
		jobFilter: function(evt, section) {

			var _filters = $('.filter-select');
			
			var _filters_secondary = $('.filter-select').filter(':not(.filter-primary)');
			
			var _filter = $(evt.currentTarget).closest('.filter-select');

			var _select = {
				filter_attr: _filter.data('filter-attr'),
				list_selector: _filter.data('list-selector'),
				select_selector: _filter.data('select-selector')
			}

			if (_filter.is('.filter-primary')) {
				_filters.find('a').removeClass('selected');
				$(_select.list_selector).removeClass('hidden').show();
			}
			else {
				_filters_secondary.find('a.selected').removeClass('selected');
			}
			
			_filter.find('a.selected').removeClass('selected');
			$(evt.currentTarget).addClass('selected');
			
			var _pri_attr = _filters.filter('.filter-primary').data('filter-attr');
			var _pri_val = _filters.filter('.filter-primary').find('a.selected').attr(_pri_attr);
			
			if (_pri_val != 'all') {
				$(_select.list_selector).filter(':not([' + _pri_attr + '="' + _pri_val + '"])').addClass('hidden').hide();
			}
			
			_filters_secondary.find('li').removeClass('hidden').show();
			
			if (_pri_val != 'all') {
			
				_filters_secondary.each(function () {
					var _sec_attr = $(this).data('filter-attr');
					
					$(this).find('li').each(function () {
						var _sec_val = $(this).find('a').attr(_sec_attr);
						
						if ($(_select.list_selector).filter('[' + _sec_attr + '="' + _sec_val + '"]').filter(':not(.hidden)').length < 1) {
							$(this).addClass('hidden').hide();
						}			
					});
				});
			}

			$(_select.list_selector).filter('.filtered').removeClass('filtered').show();
			
			_filters_secondary.filter(':has(a.selected)').each(function () {
				var _attr = $(this).find('a.selected').attr($(this).data('filter-attr'));
				$(_select.list_selector).filter(':not([' + $(this).data('filter-attr') + '="' + _attr + '"])').addClass('filtered').hide();
			});
			
			/*var _this = this,
					attr = $(evt.currentTarget).attr('id'),
					jobs = $('.job-list .dropdown'),
					$job = _this.$(attr);

			if ($(evt.currentTarget).closest('.dropdown').is('.single')) {
				$('.job-filter.dropdown ul a').removeClass('selected');
			}
			else {
				$(evt.currentTarget).closest('ul').find('a').removeClass('selected');
			}
			$(evt.currentTarget).addClass('selected');

			if ($(evt.currentTarget).closest('ul').is('.regiondd')) {

				$('ul.officedd li').show();
				
				if ($(evt.currentTarget).attr('id') == 'show-all-regions') {
					$('.job-list .dropdown').fadeIn('slow');
					return false;
				}
				$('ul.officedd li a').filter(':not([data-region-id="' + $(evt.currentTarget).attr('id') + '"])').parent('li').hide();
			}

			$('.job-list .dropdown').hide();      
			$('.job-list .dropdown').each(function(index, element) {  

				var regionId = $(element).attr('data-region-id'),
						officeId = $(element).attr('data-office-id'),
						functionId = $(element).attr('data-function-id'); 

				if (attr == regionId) {              
					$(".job-list .dropdown[data-region-id='" + regionId + "']").fadeIn('slow');
				} else if (attr == officeId) {
					$(".job-list .dropdown[data-office-id='" + officeId + "']").fadeIn('slow');
				} else if (attr == functionId) {             
					$(".job-list .dropdown[data-function-id='" + functionId + "']").fadeIn('slow'); 
				}
				
			});*/

			// TODO: Change to filter instead of each loop

			// jobs.filter( ':visible' ).filter( $( this ).data( 'region', attr ) ).css('background-color', 'red');

			// jobs.filter( ':visible' ).filter( function(index, element) { if ( $( this ).data( 'region') == attr ) {  
			// 	console.log( $( this ) ); 
			// 	jobs.hide();
			// 	$( this ).show();				
			// } return false; } );

		}
	});

	SocailButtons = View.extend({
		events: {
			'click a': 'clickHandler'
		},
		initialize: function() {
			this.pageId = this.$el.data('page-id');
			this.doTrack = this.$el.hasClass('track');
		},
		clickHandler: function(evt) {
			var $a = $(evt.currentTarget),
					href = $a.attr('href'),
					type, newWindow;

			if ( $a.hasClass('facebook') ) {
				type = 'facebook';
			} else if ( $a.hasClass('twitter') ) {
				type = 'twitter';
			} else if ( $a.hasClass('email') ) {
				type = 'email';
			} else {
				type = 'other';
			}

			if ( this.doTrack ) $.post(Site.basePath + Site.idiom + '/ajax/share/' + this.pageId + '/' + type);

			if ( type === 'facebook' ) {
				newWindow = window.open(href, 'facebook_share', 'height=320, width=640, top=200, left=200, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no');
			} else if ( type === 'twitter' ) {
				newWindow = window.open(href, 'twitter_share', 'height=400, width=575, top=200, left=200, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no');
			} else {
				return true;
			}

			newWindow.focus();
			return false;
		}
	});

	// View for navigable content
	SiteContent = View.extend({
		el: '.site-content',
		initialize: function() {
			var _this = this;

			if ( this.$('.detail-container').length > 0 ) this.$detailContainer = this.$('.detail-container');
			if ( this.$('.people-list').length > 0 ) this.peopleList = new PeopleList({ el: '.people-list' });
			if ( this.$('.hero-slideshow').length > 0 ) this.heroSlideshow = new HeroSlideshow({ el: '.hero-slideshow' });
			if ( this.$('.media-slideshow').length > 0 ) this.$('.media-slideshow').each(function() {
				this.mediaSlideshow = new MediaSlideshow({ el: $(this) });
			});
			this.fixedHeader = new FixedHeader();
			this.mediaBoxes = new MediaBoxes();
			if ( this.$('.page.offices').length > 0 ) this.offices = new Offices({ el: '.page.offices' });
			if ( this.$('.page.careers').length > 0 ) this.careers = new Careers({ el: '.page.careers' });      

			this.sharers = [];
			this.$sharers = $('.social');
			this.$sharers.each(function() { 
				var sharer = new SocailButtons({ el: $(this) });
				_this.sharers.push(sharer);
			});

			this.render();
		}
	});
	
	// View for the main navigation bar
	SiteNav = View.extend({
		el: '.site-nav',
		events: {
			'click a.handle': 'openMenu'
		},
		openMenu: function(evt) {
			this.$el.toggleClass('open');
			return false;
		}
	});
	// 'global' App view
	App = View.extend({
		el: 'body',
		events: {
			'click .page-content-nav a': 'scrollTo',
			'click .slideshow-mask a': 'expandSlideshow'
		},
		initialize: function() {
			window.app = this;
			this.siteNav = new SiteNav();
			this.siteContent = new SiteContent();
			this.router = new Router();      

			var navHeight = $(".sub-nav").height() + 210;
			$('form.search input[type=search], form.search input[type=text]').on('focus', function() {
				if ( $(this).val() === $(this).attr('placeholder') ) $(this).val('');
			}).on('blur', function() {
				if ( $(this).val() === '' ) $(this).val($(this).attr('placeholder'));
			});
			
			if ( window.location.hash && $(window.location.hash).length > 0 ) {
				$('html, body').animate({ scrollTop: $(window.location.hash).offset().top - navHeight }, 300);
			}
			//Click function to show the correct persons details.
				$('.person a').on('click', function(e){
					//e.preventDefault();
					var href = $(this).attr('href');
					var noHash = href.split('#');
					if(window.location.href == href || window.location.href == noHash[0]) {
						window.location.href = href;
						window.location.reload();
					}
				});                
		},
		onPageContentNavClick: function(evt) {
			scrollTo($(evt.currentTarget).attr('href'));
			return false;
		},
		scrollTo: function(id) {
			var offset = this.$(id).offset().top - this.$('.site-header').outerHeight(false),
					distance = Math.abs($(window).scrollTop() - offset);
					time = distance > 600 ? 600 : distance;
			$('body, html').animate({ 'scrollTop': offset }, time);
		},
		expandSlideshow: function() {
			this.siteContent.heroSlideshow.expand();
			return false;
		}
	});

	// Routing stuff
	Router = Backbone.Router.extend({
		routes: {
			'(/)': 'home',
			'work(/)': 'workIndex',
			'work/filter/:filter(/)': 'workIndex',
			'work/:token(/)': 'workView',
			'news(/)': 'newsIndex',
			'news/filter/:filter(/)': 'newsIndex',
			'news/:token(/)': 'newsView'
		},
		home: function() {
			app.siteContent.render('home', false, false);
		},
		workIndex: function(filter) {
			filter = filter || 'all';
			app.siteContent.render('work', filter, false);
		},
		workView: function(token) {
			app.siteContent.render('work', false, token);
		},
		newsIndex: function(filter) {
			filter = filter || 'all';
			app.siteContent.render('news', filter, false);
		},
		newsView: function(token) {
			app.siteContent.render('news', false, token);
		}
	});

	// Prevent scrolling because of a hash in the URL
	window.scrollTo(0, 0);

	// On page-ready
	$(document).ready(function(){

		var b = document.documentElement;
			b.setAttribute("data-useragent", Site.userAgent);
			b.setAttribute("data-platform", Site.platform);

		// BEGIN!
		app = new App();
		app.render();

		// Backbone.history.start({ pushState: true, root: '/' + Site.idiom + '/' });    

	});

}(Site));
