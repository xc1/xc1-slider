
/* Slider plugin */

(function($){

	// xc1Slider
	$.xc1Slider = function(slider, options) {
	  	
	  	// Vars
		slider.settings = $.extend({}, $.xc1Slider.defaults, options);
		slider.fn = {};
		slider.vars = {
			total: 0,
			pos: 0,
			min: 0,
			max: 0,
			current: slider.settings.current,
			slide: new Array(),
			interval: '',
			intervalspeed: 50,
			sliderheight: '',
			sliderwidth: ''
		};
		slider.markup = {
			slider: slider.addClass('slider'), // Main slider
			container: $('<div class="slider-container" />'), // The container for the slides
			slides: slider.find('ul').addClass('slider-slides slider-effect-' + slider.settings.effect), // Our slides
			slide: slider.find('li').addClass('slide'), // And our every little slide inside
			clonebefore: '', // Clonewars 
			cloneafter: '' // More clones
		};
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


		// Set certain values
		slider.vars.intervalspeed = slider.settings.delay;

		// Add markup
		slider.markup.slides.wrap(slider.markup.container);	//Wrap the slider in a container	

		// Scroll effect setup
		if(slider.settings.effect == 'scroll') { 
			
			// Set scroll vars
			slider.markup.clonebefore = slider.find('.slide').clone().addClass('clone clone-before');
			slider.markup.cloneafter = slider.find('.slide').clone().addClass('clone clone-after');	

			slider.markup.slides.prepend(slider.markup.clonebefore); // Prepend the clones
			slider.markup.slides.append(slider.markup.cloneafter); // Append the other clones		
			
			// Set the same height on all the images
			slider.find('img').each(function(index, item) {
				if(index == 0) { slider.vars.sliderheight = $(this).height(); } else if($(this).height() < slider.vars.sliderheight ) { slider.vars.sliderheight = $(this).height(); }
				
				if(index == slider.markup.slide.length-1) {
					slider.find('img').each(function(index, item) {						
						var image = new Image();
						image.src = $(this).attr('src');
						var imagewidth = Math.floor( image.width * (slider.vars.sliderheight / image.height) );
						var imageheight = slider.markup.sliderheight;
						$(this).attr('width', imagewidth).attr('height', imageheight);
						
						slider.vars.sliderwidth = Math.round(slider.vars.sliderwidth + imagewidth);
						
						if(index == slider.markup.slide.length-1) {							
							// Set Max, Min and Total values
							slider.vars.min = slider.vars.sliderwidth;
							slider.vars.max = slider.vars.sliderwidth*2;
							slider.vars.total = slider.vars.sliderwidth*3;		

							slider.markup.slides.css({'height' : slider.vars.sliderheight, 'width' : slider.vars.total});
						}
					});
				}
			});

			slider.vars.intervalspeed = slider.settings.speed/50; // Needs not hardcoded speed
	
		}
		
		// Slide effect setup
		if(slider.settings.effect == 'slide') {

			slider.markup.clonebefore = slider.find('.slide:last-child').clone().addClass('clone clone-before');
			slider.markup.cloneafter = slider.find('.slide:first-child').clone().addClass('clone clone-after');
	
			slider.markup.slides.prepend(slider.markup.clonebefore); // Prepend the clones
			slider.markup.slides.append(slider.markup.cloneafter); // Append the other clones
			
			slider.find('.slide').css({'width' : slider.width() + 'px'});

			// Set Max, Min and Total values
			//slider.vars.min = slider.markup.clonebefore.width();
			//slider.vars.max = Math.round( slider.markup.clonebefore.width() + (slider.width()*(slider.markup.slide.length+1)));
			slider.vars.total = Math.round( slider.markup.clonebefore.width() + (slider.width()*(slider.markup.slide.length+1)) + slider.markup.cloneafter.width() );
			
			slider.vars.min = 0;
			slider.vars.max = slider.vars.total;
			
			slider.markup.slides.css({'width' : slider.vars.total + 'px'});

		}
		
		// Fade effect setup
		if(slider.settings.effect == 'fade') {
			slider.find('.slide').css({'width' : slider.width() + 'px'});
		}

		// General effect setup		
		slider.markup.slide.each(function(index) {
			slider.vars.slide.push($(this).position());
			$(this).addClass('slide-' + index);
			slider.nav.slides = slider.nav.slides + '<li data-slide="' + index + '" class="' + ( index == 0 ? 'slider-nav-active ':'' ) + 'slider-nav-' + index + '"></li>';
		});	
						
		// Append the manual nav
		slider.append(slider.nav.container);
		
		slider.nav.container.append(slider.nav.slidination);
		slider.nav.container.append(slider.nav.direction);
		
		slider.nav.direction.append(slider.nav.forward);
		slider.nav.direction.append(slider.nav.backward);	
		slider.nav.slidination.append(slider.nav.slides);

	
	
		// Interactions
		slider.nav.backward.on('click', function() { slider.fn.backward(); });
		slider.nav.forward.on('click', function() { slider.fn.forward(); });
		slider.markup.slides.on('mouseover', function() { slider.fn.pause(); }).on('mouseout', function() { slider.fn.resume(); });
		
		slider.nav.slidination.find('li').on('click', function() { 
			slider.nav.slidination.find('li').removeClass('slider-nav-active'); 
			$(this).addClass('slider-nav-active'); 
			slider.fn.show($(this).data('slide'));
		});
			
		// Set the slider as loaded
		slider.data('loaded', 'true');	
	
		// Bind touch	
		slider.bind(slider.touch.start, function(evt) { evt.preventDefault(); /* console.log('touchstart' + evt.pageX); */ });
		slider.bind(slider.touch.move, function(evt) { evt.preventDefault(); /* console.log('touchmove ' + evt.pageX); */ });
		slider.bind(slider.touch.end, function(evt) { evt.preventDefault(); /* console.log('touchend ' + evt.pageX); */ });

		//autoslide();	
	
	
		// IE Fixx
		var varIE = false;
		if($('html').hasClass('ie')) { varIE = true; }	
		
		
		
		
		
		
		
		
		
		
		/* Functions */
		slider.fn.auto = function() {
			clearInterval(slider.vars.interval);
			slider.vars.interval = setInterval(function() {

				if (slider.vars.pos >= slider.vars.min && slider.vars.pos <= slider.vars.max) {
					if(slider.settings.direction == 'forward') { slider.vars.pos++; } else { slider.vars.pos--; }
				} else {
					slider.fn.reset();
				}
				if(slider.settings.effect == 'scroll') { moveslide(slider.vars.pos); } else { if(slider.settings.direction == 'forward') { slider.vars.current++; slider.fn.show(slider.vars.current); } else { slider.vars.current--; slider.fn.show(slider.vars.current); } }
		
			}, slider.vars.intervalspeed);
		}
		
		slider.fn.reset = function() {
			if(!varIE) {
				slider.markup.slides.css({'transform' : 'translate3d(-' + slider.vars.pos + 'px, 0, 0)', 'transition' : 'none ' + slider.vars.speed/1000 + 's linear'});
			} else {
				slider.markup.slides.css({'left' : '-' + slider.vars.pos + 'px'});
			}
			if(slider.settings.direction == 'forward') { slider.vars.pos = slider.vars.min; slider.fn.animate(slider.vars.max); } else { slider.vars.pos = slider.vars.max; slider.fn.animate(slider.vars.min);	}
			setTimeout(function() {
				slider.fn.show(slider.vars.current);
			}, slider.vars.speed);
			slider.dev.log('RESET slider.vars.current ' + slider.vars.current);
		}
		
		slider.fn.forward = function() {
			clearInterval(slider.vars.interval);
			slider.settings.direction = 'forward';
			slider.vars.current++;
			if(slider.vars.current > slider.vars.slide.length) { slider.vars.current = 0; slider.fn.reset(); } else { slider.fn.show(slider.vars.current); }
			
			slider.dev.log('FORW slider.vars.current ' + slider.vars.current);
		}
	
		slider.fn.backward = function() {
			clearInterval(slider.vars.interval);
			slider.settings.direction = 'backward';
			slider.vars.current--;
			if(slider.vars.current < slider.vars.slide.length) { slider.vars.current = 0; slider.fn.reset(); } else { slider.fn.show(slider.vars.current); }
			
			slider.dev.log('BACK slider.vars.current ' + slider.vars.current);
		}
		
		slider.fn.pause = function() {
			clearInterval(slider.vars.interval);
		}
		
		slider.fn.show = function(slide) {
			//slider.vars.pos = Math.floor(slider.vars.min+(slide*slider.width()));
			
			if(slider.settings.effect == 'fade') {
				//fadeslide(slide);
			} else {
				if(slider.vars.current < 0) { 
					slider.vars.pos = slider.vars.max; 
				} else if(slide >= slider.vars.slide.length) { 
					slider.vars.pos = 0; 
				} else { 
					slider.vars.pos = slider.vars.slide[slide].left; 
				}
				slider.fn.animate(slider.vars.pos);				
			}
			
			slider.dev.log('Show ' + slide);
			slider.dev.log('slider.vars.pos ' + slider.vars.pos);
		}
	
		slider.fn.resume = function()  {
			if(slider.settings.auto == true) {
				slider.fn.auto();		
			}
		}
		
		slider.fn.current = function()  {
			for(var i = 0; i < slider.vars.slide.length; i++) {				
				if(pos > slider.vars.slide[i].left) {
					slider.vars.current = i;
				}
			}						
			slider.nav.slidination.find('li').removeClass('slider-nav-active');
			slider.nav.slidination.find('li.slider-nav-' + slider.vars.current).addClass('slider-nav-active');
			
			slider.dev.log('slider.vars.current ' + slider.vars.current);
		}
		
		slider.fn.animate = function(pos) {
			if(slider.settings.effect == 'scroll') { slider.fn.current(pos); }
			if(!varIE) {
				slider.markup.slides.css({'transform' : 'translate3d(-' + pos + 'px, 0, 0)', 'transition' : 'all ' + slider.settings.speed/1000 + 's linear'});
			} else {
				slider.markup.slides.animate({'left' : '-' + pos + 'px'}, slider.settings.speed);
			}
		}

		function fadeslide(slide) {
			if(!varIE) {
				slider.markup.slides.find('.slide-' + slide).css({'z-index' : '15', 'opacity' : '1', 'transition' : 'all ' + slider.settings.speed/1000 + 's ease'});
			} else {
				slider.markup.slides.find('.slide-' + slide).css({'z-index' : '15'}).animate({'opacity' : ''}, slider.settings.speed);
			}
			setTimeout(function() { 
				slider.markup.slides.find('.slide').css({'z-index' : '5'});
				slider.markup.slides.find('.slide-' + slide).css({'z-index' : '10'});
			}, slider.settings.speed);
		}

				
		// Development environment
		slider.dev = { env: false, log: function(){} }
		if(document.domain == 'xc1-slider.dev' || document.domain == 'http://xc1-slider.dev') { slider.dev.env = true; }
		slider.dev.log  = function(log) {
			if(slider.dev.env) {
				console.log(log);
			}
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



