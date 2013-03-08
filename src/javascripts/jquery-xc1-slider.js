/* Slider plugin */

(function($) {

	// xc1Slider
	$.xc1Slider = function(slider, options) {
	  	
	  	// Vars
		slider.settings = $.extend({}, $.xc1Slider.defaults, options);
		slider.fn = {};
		slider.setup = {};
		slider.vars = {
			total: 0,
			pos: 0,
			min: 0,
			max: 0,
			length: 0,
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

		// IE Fixx
		var varIE = false;
		if($('html').hasClass('ie')) { varIE = true; }	
		
		// Functions
		slider.fn.auto = function() {
			clearInterval(slider.vars.interval);
			slider.vars.interval = setInterval(function() {
				slider.dev.log('Auto');
				slider.dev.log('slider.vars.current ' + slider.vars.current);
				slider.dev.log('slider.vars.pos ' + slider.vars.pos);
			}, slider.vars.intervalspeed);
		}
		
		slider.fn.forward = function() {
			clearInterval(slider.vars.interval);
			slider.settings.direction = 'forward';
			slider.vars.current++;
			slider.fn.show(slider.vars.current);
			slider.dev.log('Forward');
			slider.dev.log('slider.vars.current ' + slider.vars.current);
			slider.dev.log('slider.vars.pos ' + slider.vars.pos);
		}
	
		slider.fn.backward = function() {
			clearInterval(slider.vars.interval);
			slider.settings.direction = 'backward';
			slider.vars.current--;
			slider.fn.show(slider.vars.current);
			slider.dev.log('Backward');
			slider.dev.log('slider.vars.current ' + slider.vars.current);
			slider.dev.log('slider.vars.pos ' + slider.vars.pos);
		}
		
		slider.fn.pause = function() {
			clearInterval(slider.vars.interval);
		}
	
		slider.fn.resume = function() {
			if(slider.settings.auto == true) {
				slider.fn.auto();		
			}
		}
		
		slider.fn.reset = function() {
			
			if(slider.settings.direction == 'forward') {
				slider.vars.pos = 0;
				//slider.vars.pos = slider.vars.min;
				//slider.vars.current = 0;
			} else {
				slider.vars.pos = slider.vars.max;
				//slider.vars.pos = slider.vars.max;
				//slider.vars.current = slider.vars.slide.length;
			}
			
			if(!varIE) {
				slider.markup.slides.css({'transform' : 'translate3d(-' + slider.vars.pos + 'px, 0, 0)', 'transition' : 'none'});
			} else {
				slider.markup.slides.css({'left' : '-' + slider.vars.pos + 'px'});
			}
			
			//slider.fn.current();
			slider.dev.log('Reset');
			slider.dev.log('slider.vars.current ' + slider.vars.current);
			slider.dev.log('slider.vars.pos ' + slider.vars.pos);
		}
						
		slider.fn.show = function(slide) {

			slider.vars.current = slide;
			slider.vars.pos = slider.vars.slide[slide].left;

			/*

			setTimeout(function() {
				slider.fn.show(slider.vars.current);
			}, slider.vars.speed);
			slider.dev.log('RESET slider.vars.current ' + slider.vars.current);
				if (slider.vars.pos >= slider.vars.min && slider.vars.pos <= slider.vars.max) {
					if(slider.settings.direction == 'forward') { slider.vars.pos++; } else { slider.vars.pos--; }
				} else {
					slider.fn.reset();
				}
				
				
			if(slider.settings.effect == 'scroll') { moveslide(slider.vars.pos); } else { if(slider.settings.direction == 'forward') { slider.vars.current++; slider.fn.show(slider.vars.current); } else { slider.vars.current--; slider.fn.show(slider.vars.current); } }
			*/

			
			
			slider.fn.current();
			slider.fn.animate(slider.vars.pos);		
			
			slider.dev.log('Show ' + slide);
			slider.dev.log('slider.vars.current ' + slider.vars.current);
			slider.dev.log('slider.vars.pos ' + slider.vars.pos);
		}
		
		slider.fn.animate = function(pos) {
			if((slider.vars.pos <= slider.vars.min && slider.settings.direction == 'backward' && slider.settings.effect == 'scroll') || (slider.vars.pos >= slider.vars.max && slider.settings.direction == 'forward' && slider.settings.effect == 'scroll')) { slider.fn.reset(); }
			if(slider.settings.effect == 'scroll') { slider.fn.current(pos); }
			if(!varIE) {
				slider.markup.slides.css({'transform' : 'translate3d(-' + pos + 'px, 0, 0)', 'transition' : 'all ' + slider.settings.speed/1000 + 's linear'});
			} else {
				slider.markup.slides.animate({'left' : '-' + pos + 'px'}, slider.settings.speed);
			}
			//if((slider.vars.current <= 0 && slider.settings.direction == 'backward') || (slider.vars.current >= slider.vars.slide.length && slider.settings.direction == 'forward') || (slider.vars.pos <= slider.vars.min && slider.settings.direction == 'backward' && slider.settings.effect == 'scroll') || (slider.vars.pos >= slider.vars.max && slider.settings.direction == 'forward' && slider.settings.effect == 'scroll')) { slider.fn.reset(); }
			
			if((slider.vars.current <= 0 && slider.settings.direction == 'backward') || (slider.vars.current >= slider.vars.length && slider.settings.direction == 'forward')) { slider.fn.reset(); }
			
			slider.dev.log('Animate');
			slider.dev.log('slider.vars.current ' + slider.vars.current);
			slider.dev.log('slider.vars.pos ' + slider.vars.pos);
		}
		
		slider.fn.current = function()  {
		
			//if(slider.vars.current > slider.vars.slide.length) { slider.vars.current = 0; slider.fn.reset(); } else { slider.fn.show(slider.vars.current); }
			//if(slider.vars.current < slider.vars.slide.length) { slider.vars.current = 0; slider.fn.reset(); } else { slider.fn.show(slider.vars.current); }
			if(slider.settings.effect == 'scroll') {
				for(var i = 0; i < slider.vars.slide.length-1; i++) {				
					if(slider.vars.pos > (slider.vars.slide[i].left-(slider.width()/2))) {
						slider.vars.current = i;
					}
				}						
			}
			slider.nav.slidination.find('li').removeClass('slider-nav-active');
			slider.nav.slidination.find('li.slider-nav-' + slider.vars.current).addClass('slider-nav-active');
			
			slider.dev.log('Current');
			slider.dev.log('slider.vars.current ' + slider.vars.current);
			slider.dev.log('slider.vars.pos ' + slider.vars.pos);
		}

		/*

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

		*/
		// Setup functions
		slider.setup.scroll = function() {
				
			// Set scroll vars
			slider.markup.clonebefore = slider.find('.slide').clone().addClass('clone clone-before');
			slider.markup.cloneafter = slider.find('.slide').clone().addClass('clone clone-after');	

			slider.markup.slides.prepend(slider.markup.clonebefore); // Prepend the clones
			slider.markup.slides.append(slider.markup.cloneafter); // Append the other clones		
			
			// Set the same height on all the images
			slider.find('img').each(function(index, item) {
				if(index == 0) { slider.vars.sliderheight = $(this).height(); } else if($(this).height() < slider.vars.sliderheight ) { slider.vars.sliderheight = $(this).height(); }
				
				if(index == slider.vars.length) {
					slider.find('img').each(function(index, item) {						
						var image = new Image();
						image.src = $(this).attr('src');
						var imagewidth = Math.floor( image.width * (slider.vars.sliderheight / image.height) );
						var imageheight = slider.markup.sliderheight;
						$(this).attr('width', imagewidth).attr('height', imageheight);
						
						slider.vars.sliderwidth = Math.round(slider.vars.sliderwidth + imagewidth);
						
						if(index == slider.vars.length) {							
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
			slider.setup.markup();
		}
		
		slider.setup.slide = function() {
			
			slider.markup.clonebefore = slider.find('.slide:last-child').clone().addClass('clone clone-before');
			slider.markup.cloneafter = slider.find('.slide:first-child').clone().addClass('clone clone-after');
	
			slider.markup.slides.prepend(slider.markup.clonebefore); // Prepend the clones
			slider.markup.slides.append(slider.markup.cloneafter); // Append the other clones
			
			slider.find('.slide').css({'width' : slider.width() + 'px'});

			// Set Max, Min and Total values
			slider.vars.min = slider.markup.clonebefore.width();
			slider.vars.max = Math.round( slider.markup.clonebefore.width() + (slider.width()*(slider.vars.length+3)));
			slider.vars.total = Math.round( slider.markup.clonebefore.width() + (slider.width()*(slider.vars.length+3)) + slider.markup.cloneafter.width() );
			
			slider.vars.pos = Math.round(slider.vars.min + (slider.width()*slider.vars.current));
			
			if(!varIE) {
				slider.markup.slides.css({'transform' : 'translate3d(-' + slider.vars.pos + 'px, 0, 0)', 'transition' : 'none'});
			} else {
				slider.markup.slides.css({'left' : '-' + slider.vars.pos + 'px'});
			}
			
			slider.markup.slides.css({'width' : slider.vars.total + 'px'});

			slider.setup.markup();
		}
		
		slider.setup.fade = function() {
			slider.find('.slide').css({'width' : slider.width() + 'px'});
			slider.setup.markup();
		}
		
		slider.setup.markup = function() {
			// General effect setup		
			slider.markup.slide.each(function(index) {
				slider.vars.slide.push($(this).position());
				$(this).addClass('slide-' + index);
				slider.nav.slides = slider.nav.slides + '<li data-slide="' + index + '" class="' + ( index == slider.vars.current ? 'slider-nav-active ':'' ) + 'slider-nav-' + index + '"></li>';
				slider.vars.length = index;
			});	
						
			// Append the manual nav
			slider.append(slider.nav.container);
			
			slider.nav.container.append(slider.nav.slidination);
			slider.nav.container.append(slider.nav.direction);
			
			slider.nav.direction.append(slider.nav.forward);
			slider.nav.direction.append(slider.nav.backward);	
			slider.nav.slidination.append(slider.nav.slides);
			slider.setup.init();

		}
		
		slider.setup.init = function() {
			
			// Interactions
			slider.nav.backward.on('click', function() { slider.fn.backward(); });
			slider.nav.forward.on('click', function() { slider.fn.forward(); });
			slider.markup.slides.on('mouseover', function() { slider.fn.pause(); }).on('mouseout', function() { slider.fn.resume(); });
			
			slider.nav.slidination.find('li').on('click', function() { 
				slider.fn.show($(this).data('slide'));
			});
				
			// Set the slider as loaded
			slider.data('loaded', 'true');	
		
			// Bind touch	
			slider.bind(slider.touch.start, function(evt) { evt.preventDefault(); /* console.log('touchstart' + evt.pageX); */ });
			slider.bind(slider.touch.move, function(evt) { evt.preventDefault(); /* console.log('touchmove ' + evt.pageX); */ });
			slider.bind(slider.touch.end, function(evt) { evt.preventDefault(); /* console.log('touchend ' + evt.pageX); */ });
		
			slider.dev.log('Length ' + slider.vars.length);


		}
							
		// Development environment
		slider.dev = { env: false, log: function(){} }
		if(document.domain == 'xc1-slider.dev' || document.domain == 'http://xc1-slider.dev') { slider.dev.env = true; }
		slider.dev.log  = function(log) {
			if(slider.dev.env) {
				console.log(log);
			}
		}
		

		// Set certain values
		slider.vars.intervalspeed = slider.settings.delay;

		// Add markup
		slider.markup.slides.wrap(slider.markup.container);	//Wrap the slider in a container	

		// Effect setup
		if(slider.settings.effect == 'scroll') { slider.setup.scroll(); }
		if(slider.settings.effect == 'slide') { slider.setup.slide(); }
		if(slider.settings.effect == 'fade') { slider.setup.fade(); }
		
		// Here is where the fun starts! Magic!
		
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