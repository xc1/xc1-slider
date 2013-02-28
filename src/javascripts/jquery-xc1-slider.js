/* Slider plugin */

(function($){

	// xc1Slider
	$.xc1Slider = function(slider, options) {
	  	
	  	/* Vars */
		slider.vars = $.extend({}, $.xc1Slider.defaults, options);
		slider.markup = {
			slider: slider.addClass('slider'), // Main slider
			container: $('<div class="slider-container" />'), // The container for the slides
			slides: slider.find('ul').addClass('slider-slides slider-effect-' + slider.vars.effect), // Our slides
			slide: slider.find('li').addClass('slide').css({'width' : slider.width() + 'px'}), // And our every little slide inside
			clonebefore: slider.find('.slide').clone().addClass('clone clone-before'), // Clonewars 
			cloneafter: slider.find('.slide').clone().addClass('clone clone-after') // More clones
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
		slider.markup.slides.prepend(slider.markup.clonebefore); // Prepend the clones
		slider.markup.slides.append(slider.markup.cloneafter); // Append the other clones
					
		slider.markup.slide.each(function(item) {
			slider.vars.min = Math.round(slider.vars.min+$(this).width());
			slider.vars.slide.push($(this).position());
			slider.nav.slides = slider.nav.slides + '<li data-slide="' + item + '" class="' + ( item == 0 ? 'slider-nav-active ':'' ) + 'slider-nav-' + item + '"></li>';
		});

		// Set Max, Min and Total values
		slider.vars.min = slider.vars.min*1;
		slider.vars.max = slider.vars.min*2;
		slider.vars.total = slider.vars.min*3;
						

		// Append the manual nav
		slider.append(slider.nav.container)
		
		slider.nav.container.append(slider.nav.slidination);
		slider.nav.container.append(slider.nav.direction);
		
		slider.nav.direction.append(slider.nav.forward);
		slider.nav.direction.append(slider.nav.backward);	
		slider.nav.slidination.append(slider.nav.slides);
		

		

		
		slider.markup.slides.css({'width' : slider.vars.total + 'px'});
	
		// Interactions
		slider.nav.backward.on('click', function() { backward(1); });
		slider.nav.forward.on('click', function() { forward(1); });
		
		slider.markup.slides.on('mouseover', function() { pause(); }).on('mouseout', function() { resume(); });
		
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

		autoslide(1);	
		if(slider.vars.effect == 'scroll') {
			slider.vars.intervalspeed = slider.vars.speed;
		} else {
			slider.vars.intervalspeed = slider.vars.delay;
		}
	
	
		// IE Fixx
		var varIE = false;
		if($('html').hasClass('ie')) { varIE = true; }	
		
		/* Functions */
		function autoslide(speed) {
			clearInterval(slider.vars.interval);
			slider.vars.interval = setInterval(function() {

				if (slider.vars.pos >= slider.vars.min && slider.vars.pos <= slider.vars.max) {
					if(slider.vars.direction == 'forward') { slider.vars.pos++; } else { slider.vars.pos--; }
				} else {
					if(slider.vars.direction == 'forward') { slider.vars.pos = slider.vars.min; } else { slider.vars.pos = slider.vars.max;	}
				}
				if(slider.vars.effect == 'scroll') { moveslide(slider.vars.pos); } else { if(slider.vars.direction == 'forward') { gotoslide(slider.vars.current++); } else { gotoslide(slider.vars.current--); } }
		
			}, slider.vars.intervalspeed/speed);
		}
		
		function forward(speed) {
			gotoslide(slider.vars.current++);
			slider.vars.direction = 'forward';
		}
	
		function backward(speed) {
			gotoslide(slider.vars.current--); 
			slider.vars.direction = 'backward';
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
				autoslide(1);		
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



