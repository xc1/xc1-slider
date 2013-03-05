/* Slider plugin */

(function($){

	// xc1Slider
	$.xc1Slider = function(slider, options) {
	  	
	  	// Vars
		slider.vars = $.extend({}, $.xc1Slider.defaults, options);
		slider.markup = {
			slider: slider.addClass('slider'), // Main slider
			container: $('<div class="slider-container" />'), // The container for the slides
			slides: slider.find('ul').addClass('slider-slides slider-effect-' + slider.vars.effect), // Our slides
			slide: slider.find('li').addClass('slide'), // And our every little slide inside
			clonebefore: '', // Clonewars 
			cloneafter: '' // More clones
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
		slider.scroll = {
			sliderheight: '',
			sliderwidth: ''
		};

		// Set certain values
		slider.vars.intervalspeed = slider.vars.delay;


		// Add markup
		slider.markup.slides.wrap(slider.markup.container);	//Wrap the slider in a container	

		// Scroll effect setup
		if(slider.vars.effect == 'scroll') { 
			
			// Set scroll vars
			slider.markup.clonebefore = slider.find('.slide').clone().addClass('clone clone-before');
			slider.markup.cloneafter = slider.find('.slide').clone().addClass('clone clone-after');	

			slider.markup.slides.prepend(slider.markup.clonebefore); // Prepend the clones
			slider.markup.slides.append(slider.markup.cloneafter); // Append the other clones		
			
			// Set the same height on all the images
			slider.find('img').each(function(index, item) {
				if(index == 0) { slider.scroll.sliderheight = $(this).height(); } else if($(this).height() < slider.scroll.sliderheight ) { slider.scroll = $(this).height(); }
				
				if(index == slider.markup.slide.length-1) {
					slider.find('img').each(function(index, item) {						
						var image = new Image();
						image.src = $(this).attr('src');
						var imagewidth = Math.floor( image.width * (slider.scroll.sliderheight / image.height) );
						var imageheight = slider.scroll.sliderheight;
						$(this).attr('width', imagewidth).attr('height', imageheight);
						
						slider.scroll.sliderwidth = Math.round(slider.scroll.sliderwidth + imagewidth);
						
						if(index == slider.markup.slide.length-1) {							
							// Set Max, Min and Total values
							slider.vars.min = slider.scroll.sliderwidth;
							slider.vars.max = slider.scroll.sliderwidth*2;
							slider.vars.total = slider.scroll.sliderwidth*3;		

							slider.markup.slides.css({'height' : slider.scroll.sliderheight, 'width' : slider.vars.total});
							
							console.log(slider.markup.clonebefore.width() + ' ' + slider.markup.slides.width() + ' ' + slider.markup.cloneafter.width() + ' ' + slider.vars.total + ' ' + slider.vars.max + ' ' + slider.vars.min);
						}
					});
				}
			});

			slider.vars.intervalspeed = slider.vars.speed/50;
	
		}
		
		// Slide effect setup
		if(slider.vars.effect == 'slide') {

			slider.markup.clonebefore = slider.find('.slide:last-child').clone().addClass('clone clone-before');
			slider.markup.cloneafter = slider.find('.slide:first-child').clone().addClass('clone clone-after');
	
			slider.markup.slides.prepend(slider.markup.clonebefore); // Prepend the clones
			slider.markup.slides.append(slider.markup.cloneafter); // Append the other clones
			
			slider.find('.slide').css({'width' : slider.width() + 'px'});

			// Set Max, Min and Total values
			slider.vars.min = slider.markup.clonebefore.width();
			slider.vars.max = Math.round( slider.markup.clonebefore.width() + slider.markup.slides.width());
			slider.vars.total = Math.round( slider.markup.clonebefore.width() + slider.markup.slides.width() + slider.markup.cloneafter.width() );
			
			slider.markup.slides.css({'width' : slider.vars.total + 'px'});

		}
		
		// Fade effect setup
		if(slider.vars.effect == 'fade') {
			slider.find('.slide').css({'width' : slider.width() + 'px'});
		}


		// General effect setup		
		slider.markup.slide.each(function(index) {
			//slider.vars.min = Math.round(slider.vars.min+$(this).width());
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
		slider.nav.backward.on('click', function() { backward(); });
		slider.nav.forward.on('click', function() { forward(); });
		slider.markup.slides.on('mouseover', function() { pause(); }).on('mouseout', function() { resume(); });
		
		slider.nav.slidination.find('li').on('click', function() { 
			slider.nav.slidination.find('li').removeClass('slider-nav-active'); 
			$(this).addClass('slider-nav-active'); 
			gotoslide($(this).data('slide'));
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
		function autoslide() {
			clearInterval(slider.vars.interval);
			slider.vars.interval = setInterval(function() {

				if (slider.vars.pos >= slider.vars.min && slider.vars.pos <= slider.vars.max) {
					if(slider.vars.direction == 'forward') { slider.vars.pos++; } else { slider.vars.pos--; }
				} else {
					if(slider.vars.direction == 'forward') { slider.vars.pos = slider.vars.min; } else { slider.vars.pos = slider.vars.max;	}
				}
				if(slider.vars.effect == 'scroll') { moveslide(slider.vars.pos); } else { if(slider.vars.direction == 'forward') { slider.vars.current++; gotoslide(slider.vars.current); } else { slider.vars.current--; gotoslide(slider.vars.current); } }
		
			}, slider.vars.intervalspeed);
		}
		
		function forward() {
			//clearInterval(slider.vars.interval);
			slider.vars.direction = 'forward';
			slider.vars.current++;
			gotoslide(slider.vars.current);
		}
	
		function backward() {
			//clearInterval(slider.vars.interval);
			slider.vars.direction = 'backward';
			slider.vars.current--;
			gotoslide(slider.vars.current); 
		}
		
		function pause() {
			clearInterval(slider.vars.interval);
		}
		
		function gotoslide(slide) {
			//slider.vars.pos = Math.floor(slider.vars.min+(slide*slider.width()));
			if(slide > slider.vars.slide.length) { slide = 0; } else if(slide < slider.vars.slide.length) { slide = slider.vars.slide.length; }
			if(slider.vars.effect == 'fade') {
				fadeslide(slide);
			} else {
				slider.vars.pos = slider.vars.slide[slide].left;
				moveslide(slider.vars.pos);				
			}

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
			slider.nav.slidination.find('li').removeClass('slider-nav-active');
			slider.nav.slidination.find('li.slider-nav-' + slider.vars.current).addClass('slider-nav-active');
		}
		
		function moveslide(pos) {
			currentslide(pos);
			if(!varIE) {
				slider.markup.slides.css({'transform' : 'translate3d(-' + pos + 'px, 0, 0)', 'transition' : 'all ' + slider.vars.speed/1000 + 's linear'});
			} else {
				slider.markup.slides.animate({'left' : '-' + pos + 'px'}, slider.vars.speed);
			}
		}

		function fadeslide(slide) {
			if(!varIE) {
				slider.markup.slides.find('.slide-' + slide).css({'z-index' : '15', 'opacity' : '1', 'transition' : 'all ' + slider.vars.speed/1000 + 's ease'});
			} else {
				slider.markup.slides.find('.slide-' + slide).css({'z-index' : '15'}).animate({'opacity' : ''}, slider.vars.speed);
			}
			setTimeout(function() { 
				slider.markup.slides.find('.slide').css({'z-index' : '5'});
				slider.markup.slides.find('.slide-' + slide).css({'z-index' : '10'});
			}, slider.vars.speed);
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



