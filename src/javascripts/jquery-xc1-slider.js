/* Slider plugin */

(function($){

	// xc1Slider
	$.xc1Slider = function(slider, options) {
	  	
	  	/* Vars */
		slider.vars = $.extend({}, $.xc1Slider.defaults, options);
		slider.markup = {
			slider: slider.addClass('slider'),
			container: $('<div class="slider-container" />'),
			slides: slider.find('ul').addClass('slider-slides slider-effect-' + slider.vars.effect),
			slide: slider.find('li').addClass('slide').css({'width' : slider.width() + 'px'}),
			clonebefore: slider.find('.slide').clone().addClass('clone clone-before'),
			cloneafter: slider.find('.slide').clone().addClass('clone clone-after')
		}
		slider.nav = {
			container: $('<div class="slider-nav-container"></div>'), 
			slidination: $('<ul class="slider-nav-slidination"></ul>'), 
			direction: $('<ul class="slider-nav-direction"></ul>'), 
			forward: $('<li class="slider-nav-forward">&lt;</li>'),
			backward: $('<li class="slider-nav-backward">&gt;</li>'),
			slides: ''
		};
		slider.touch = {
			start: 'touchstart mousedown',
			move: 'touchmove mousemove',
			end: 'touchend mouseup'
		};
						
		// Add markup
		slider.markup.slides.wrap(slider.markup.container);	//Wrap the slider in a container	
		slider.markup.slides.prepend(slider.markup.clonebefore);
		slider.markup.slides.append(slider.markup.cloneafter);
					
		//slider.vars.slide = new Array();
		//if(slider.vars.effect != 'scroll') {
			slider.markup.slide.each(function(item) {
				slider.vars.slide.push($(this).position());
				slider.nav.slides = slider.nav.slides + '<li data-slide="' + item + '" class="' + ( item == 0 ? 'slider-nav-active ':'' ) + 'slider-nav-' + item + '"></li>';
			});
		//}

		// Append the manual nav
		slider.append(slider.nav.container)
		
		slider.nav.container.append(slider.nav.slidination);
		slider.nav.container.append(slider.nav.direction);
		
		slider.nav.direction.append(slider.nav.forward);
		slider.nav.direction.append(slider.nav.backward);	
		slider.nav.slidination.append(slider.nav.slides);
		
		// Set Max, Min and Total values
		/*
		for(var i = 0; i < slider.vars.slide.length; i++) {				
			slider.vars.min = Math.round(slider.vars.min+slider.vars.slide[i].width());
		}
		*/
		
		slider.vars.min = slider.markup.slides.width()*1;
		slider.vars.max = slider.markup.slides.width()*2;
		slider.vars.total = slider.markup.slides.width()*3;
		
		slider.markup.slides.css({'width' : slider.vars.total + 'px'});
	
		// Click events
		slider.nav.backward.on('click', function() { backward(1); });
		slider.nav.forward.on('click', function() { forward(1); });
		slider.nav.slidination.find('li').on('click', function() { 
			slider.nav.slidination.find('li').removeClass('slider-nav-active'); 
			$(this).addClass('slider-nav-active'); 
			gotoslide($(this).data('slide'));
		});
			
		// Set the slider as loaded
		slider.data('loaded', 'true');	
	
		// Bind touch	
		slider.bind(slider.touch.start, function(evt) { evt.preventDefault(); console.log('touchstart' + evt.pageX); });
		slider.bind(slider.touch.move, function(evt) { evt.preventDefault(); /* console.log('touchmove ' + evt.pageX); */ });
		slider.bind(slider.touch.end, function(evt) { evt.preventDefault(); console.log('touchend ' + evt.pageX); });

		forward(1);	
		if(slider.vars.effect == 'scroll') {
			slider.vars.intervalspeed = slider.vars.speed;
		} else {
			slider.vars.intervalspeed = slider.vars.delay;
		}
	
	
		// IE Fixx
		var varIE = false;
		if($('html').hasClass('ie')) { varIE = true; }	
		
		/* Functions */	
		function forward(speed) {
			clearInterval(slider.vars.interval);
			
			slider.vars.interval = setInterval(function() {
				if (slider.vars.pos >= slider.vars.min && slider.vars.pos <= slider.vars.max) {
					if(slider.vars.effect == 'scroll') { slider.vars.pos++; } else { slider.vars.pos = Math.floor(slider.vars.pos+slider.width()); }
				} else {
					slider.vars.pos = slider.vars.min;
				}
				slider.vars.direction = 'forward';
				moveslide(slider.vars.pos);
			}, slider.vars.intervalspeed/speed);
		}
	
		function backward(speed) {
			clearInterval(slider.vars.interval);
			slider.vars.interval = setInterval(function() {				
				if (slider.vars.pos >= slider.vars.min && slider.vars.pos <= slider.vars.max) {
					if(slider.vars.effect == 'scroll') { slider.vars.pos--; } else { slider.vars.pos = Math.floor(slider.vars.pos-slider.width()); }
				} else {
					slider.vars.pos = slider.vars.max;
				}
				slider.vars.direction = 'backward';
				moveslide(slider.vars.pos);
			}, slider.vars.intervalspeed/speed);
		}
		
		function pause() {
			clearInterval(slider.vars.interval);
		}
		
		function gotoslide(slide) {
			//slider.vars.pos = Math.floor(slider.vars.min+(slide*slider.width()));
			slider.vars.pos = slider.vars.slide[slide].left;
			moveslide(slider.vars.pos);
		}
	
		function resume() {
			if(slider.vars.auto == true) {
				if(slider.vars.direction == 'forward') {
					forward(1);		
				} else {
					backward(1);
				}
			}
		}
		
		function currentslide(pos) {
			for(var i = 0; i < slider.vars.slide.length; i++) {				
				if(pos > slider.vars.slide[i].left) {
					slider.vars.current = i;
				}
			}
			//console.log(slider.vars.current);
						
			slider.nav.slidination.find('li').removeClass('slider-nav-active');
			slider.nav.slidination.find('li.slider-nav-' + slider.vars.current).addClass('slider-nav-active');
		}
		
		function moveslide(pos) {
			currentslide(pos);
			if(!varIE) {
				slider.markup.slides.css({'transform' : 'translate3d(-' + pos + 'px, 0, 0)', 'transition' : 'all ' + slider.vars.speed/1000 + 's ease'});
			} else {
				slider.markup.slides.animate({'left' : '-' + pos + 'px'}, slider.vars.speed);
			}
		}
	
		function xc1SliderImages(infiniteSlider) {
			var sectionHeight = infiniteSlider.height();	
		
			$('li img', infiniteSlider).each(function(index, item) {
				var newImage = new Image();
				newImage.src = $(this).attr('src');
				var newWidth = Math.floor( newImage.width * (sectionHeight / newImage.height) );
				var newHeight = sectionHeight;
				
				$(this).attr('width', newWidth).attr('height', newHeight).parent().css({'width' : newWidth + 'px', 'height' : newHeight + 'px'});
							
				if(index == $('li', infiniteSlider).length-1) {
					if(infiniteSlider.data('auto') == 'auto') { var infiniteAuto = true } else { var infiniteAuto = false }
					if(infiniteSlider.data('speed') == '') { var infiniteSpeed = 70 } else { var infiniteSpeed = infiniteSlider.data('speed'); }	
					xc1SliderInit(infiniteSlider, infiniteAuto, infiniteSpeed);
				}
			});
		}
	}


  
	//xc1Slider: Defaults
	$.xc1Slider.defaults = {
		auto: true,						// Autoslide "true" or "false"
		effect: 'slide', 				// Effect "slide", "scroll", "fade"
		direction: 'forward',			//
		speed: 500, 					// Milliseconds each slide is shown
		delay: 3000, 					//
		current: 1,						// The current slide, to start on another slide
		/*
		animation: "fade",              //String: Select your animation type, "fade" or "slide"
		slideDirection: "horizontal",   //String: Select the sliding direction, "horizontal" or "vertical"
		slideshow: true,                //Boolean: Animate slider automatically
		slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
		animationDuration: 600,         //Integer: Set the speed of animations, in milliseconds
		directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
		controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
		keyboardNav: true,              //Boolean: Allow slider navigating via keyboard left/right keys
		mousewheel: false,              //Boolean: Allow slider navigating via mousewheel
		prevText: "Previous",           //String: Set the text for the "previous" directionNav item
		nextText: "Next",               //String: Set the text for the "next" directionNav item
		pausePlay: false,               //Boolean: Create pause/play dynamic element
		pauseText: 'Pause',             //String: Set the text for the "pause" pausePlay item
		playText: 'Play',               //String: Set the text for the "play" pausePlay item
		randomize: false,               //Boolean: Randomize slide order
		slideToStart: 0,                //Integer: The slide that the slider should start on. Array notation (0 = first slide)
		animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
		pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
		pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
		controlsContainer: "",          //Selector: Declare which container the navigation elements should be appended too. Default container is the flexSlider element. Example use would be ".flexslider-container", "#container", etc. If the given element is not found, the default action will be taken.
		manualControls: "",             //Selector: Declare custom control navigation. Example would be ".flex-control-nav li" or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
		start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
		before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
		after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
		end: function(){}               //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
		*/
		total: 0,
		pos: 0,
		min: 0,
		max: 0,
		slide: new Array(),
		interval: '',
		intervalspeed: 50
	}
	
	//xc1Slider: Plugin
	$.fn.xc1Slider = function(options) {
		return this.each(function() {
			if ($(this).find('ul > li').length != 1 && $(this).data('loaded') != true) {
				new $.xc1Slider($(this), options);	
			} else {
				$(this).find('ul > li').fadeIn();
			}
		});
	}  
  
})(jQuery);



