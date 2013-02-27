/*  */

(function($){

  // xc1Slider
  $.xc1Slider = function(slider, options) {
  	
  	/* Vars */
	slider.vars = $.extend({}, $.xc1Slider.defaults, options);
	
	var slides = slider.find('.slider-slides');
	
	var varInterval;
	
	
	// IE Fixx
	var varIE = false;
	if($('html').hasClass('ie')) { varIE = true; }	
	
	/* Functions */
		
	
		slider.vars.min = slides.width()*1;
		slider.vars.max = slides.width()*2;
		slider.vars.total = slides.width()*3;
		
		
		var content = new Array();
			
		content.push(slides.children().slice().clone(true).addClass('slide-clone'));
		content.push(slides.children().slice().clone(true).addClass('slide-clone'));
		
		for(var i = 0; i < content.length; i++) {
			slides.append(content[i]);
		}
		

		forward(slider.vars.speed);

	// Navigations
	function nav() {
		
	}



	
	// Functions
	function forward(speed) {
		clearInterval(varInterval);
		varInterval = setInterval(function() {
			if(!varIE) {
				slides.attr('style', 'width: ' + slider.vars.total + 'px; -moz-transform: translate3d(-' + slider.vars.pos +'px, 0, 0); -webkit-transform:translate3d(-' + slider.vars.pos +'px,0,0); transform:translate3d(-' + slider.vars.pos +'px,0,0);');
			} else {
				slides.css({'left' : '-' + slider.vars.pos + 'px'});
			}
			
			if (slider.vars.pos >= slider.vars.min && slider.vars.pos <= slider.vars.max) {
				slider.vars.pos++;
			} else {
				slider.vars.pos = slider.vars.min;
			}
			slider.vars.direction = 'forward';
		}, slider.vars.speed/speed);
	}

	function backward(speed) {
		clearInterval(varInterval);
		varInterval = setInterval(function() {
			if(!varIE) {
				slides.attr('style', 'width: ' + slider.vars.total + 'px; -moz-transform: translate3d(-' + slider.vars.pos +'px, 0, 0); -webkit-transform:translate3d(-' + slider.vars.pos +'px,0,0); transform:translate3d(-' + slider.vars.pos +'px,0,0);');
			} else {
				slides.css({'left' : '-' + slider.vars.pos + 'px'});
			}
			
			if (slider.vars.pos >= slider.vars.min && slider.vars.pos <= slider.vars.max) {
				slider.vars.pos--;
			} else {
				slider.vars.pos = slider.vars.max;
			}
			slider.vars.direction = 'backward';
		}, slider.vars.speed/speed);
	}
	
	function pause() {
		clearInterval(varInterval);
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




/*

	function xc1Slider() {
		var xc1Sliders = new Array();
		
		$('.infinite-slides').each(function(index, item) {
			xc1SliderImages($(this));
		});
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
	
	
	function xc1SliderInit(infiniteSlider, infiniteAuto, infiniteSpeed) {
			
		
	
		
		if(!infiniteSliderLoaded) {
		
			// Navigation
			//var varPause = $('<div class="infinite-scroll-pause"></div>');
			var varForward = $('<div class="infinite-scroll-forward"></div>');
			var varBackward = $('<div class="infinite-scroll-backward"></div>');
			var varPause = infiniteSliderItems;
			
			// Append navigation
			//infiniteSliderContainer.append(varPause);
			infiniteSliderContainer.append(varForward);
			infiniteSliderContainer.append(varBackward);
			
			// Bind the Navigation
			varPause.on('mouseover', function() { infinitePause(); }).on('mouseout', function() { infiniteResume(); });
			varForward.on('mouseover', function() { infiniteForward(4); }).on('mouseout', function() { infiniteResume(); });
			varBackward.on('mouseover', function() { infiniteBackward(4); }).on('mouseout', function() { infiniteResume(); });
			
			// Append extra content
			var content = new Array();
			
			content.push(infiniteSliderItems.slice().clone(true));
			content.push(infiniteSliderItems.slice().clone(true));
			content.push(infiniteSliderItems.slice().clone(true));
			content.push(infiniteSliderItems.slice().clone(true));
			content.push(infiniteSliderItems.slice().clone(true));
			
			for(var i = 0; i < content.length; i++) {
				infiniteSlider.append(content[i]);
			}
		
		}
		
		// Set sizes
		infiniteSliderItems.each(function() {
			varWidth = Math.round(varWidth + $(this).width());
		});
		infiniteSlider.css({'width' : varWidth*6 + 'px'});
		
		// Set Positions
		varPosMax = varWidth*4;
		varPosMin = varWidth*2;
		
		// Start the slider on init
		if(infiniteAuto == true && !infiniteSliderLoaded) {
			infiniteForward(1);
		}
			
				
	
	}

	
	
	*/
	
	
/*
		

		$("ul.slider-manual-nav a").on('click', function () {
			var navVal = $(this).attr("href");
			
			$('.slider-manual-nav li a.active').removeClass('active');
			
			$(this).addClass('active');
			navVal = navVal.replace('#', '');
			$slider.trigger('goto', parseInt(navVal, 10));
			
			return false;
		});

		var listcount = $slider.find('> li').size(),
			appendlist = '';
		
		for (i = 1; i <= listcount; i++) {
			appendlist = appendlist + '<li><a href="#'+i+'" ' + (i==1?'class="active"':'') + '> </a></li>';
		}
		
		$('.slider-manual-nav').append(appendlist);
		
	    function repeat(str, num) {
	        return new Array( num + 1 ).join( str );
	    }
  
	    return this.each(function () {
	        var singleWidth = $single.outerWidth(), 
	            visible = Math.ceil($wrapper.innerWidth() / singleWidth), // note: doesn't include padding or border
	            currentPage = 1,
	            pages = Math.ceil($items.length / visible);            


	        // 1. Pad so that 'visible' number will always be seen, otherwise create empty items
	        if (($items.length % visible) != 0) {
	            $slider.append(repeat('<li class="empty" />', visible - ($items.length % visible)));
	            $items = $slider.find('> li');
	        }

	        // 2. Top and tail the list with 'visible' number of items, top has the last section, and tail has the first
	        $items.filter(':first').before($items.slice(- visible).clone().addClass('cloned'));
	        $items.filter(':last').after($items.slice(0, visible).clone().addClass('cloned'));
	        $items = $slider.find('> li'); // reselect
        
	        // 3. Set the left position to the first 'real' item
	        $wrapper.scrollLeft(singleWidth * visible);

	        // 4. paging function
	        function gotoPage(page) {
	            var dir = page < currentPage ? -1 : 1,
	                n = Math.abs(currentPage - page),
	                left = singleWidth * dir * visible * n;
            
	            $wrapper.filter(':not(:animated)').animate({
	                scrollLeft : '+=' + left
	            }, 500, function () {
	                if (page == 0) {
	                    $wrapper.scrollLeft(singleWidth * visible * pages);
	                    page = pages;
	                } else if (page > pages) {
						$wrapper.scrollLeft(singleWidth * visible);
	                    page = 1;
	                } 

	                currentPage = page;
					$(".slider-manual-nav li a.active").removeClass("active");
					$("ul.slider-manual-nav li:nth-child("+currentPage+") a").addClass("active");
	            });                
            
	            return false;
	        }
        	
	        // 5. Bind to the forward and back buttons
	        $('a.back').click(function () {
				return gotoPage(currentPage - 1);   
	        });
        
	        $('a.forward').click(function () {						
				return gotoPage(currentPage + 1); 
	        });
        
	        // create a public interface to move to a specific page
	        $(this).bind('goto', function (event, page) {
	            gotoPage(page);
	        });
	    });  
*/
	}

	// Load everything first time
	function loadSlider(slider, options) {
		// Add markup
		slider.find('ul').addClass('slider-slides').wrap('<div class="slider-container" />');	//Wrap the slider in a container	
		slider.find('li').addClass('slide');
		
		slider.append('<div class="slider-nav-container"><ul class="slider-nav-pagination"></ul><ul class="slider-nav-direction"><li class="slider-nav-left"><a href="#" title="Previous">&lt;</a></li><li class="slider-nav-right"><a href="#" title="Next">&gt;</a></li></ul></div>'); // Append the manual nav
		
		// Set the slider as loaded
		slider.data('loaded', 'true');
		
		new $.xc1Slider(slider, options);	
	}
	
	// Restart when allready loaded
	function restartSlider(slider, options) {
		
	}
  
  //xc1Slider: Defaults
  $.xc1Slider.defaults = {
	auto: true,						// Autoslide "true" or "false"
	effect: 'slide', 				// Effect "slide", "scroll", "fade"
	direction: 'forward',			//
	speed: 500, 					// Milliseconds each slide is shown
	delay: 3000, 					//	
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
	max: 0
  }
  
  //xc1Slider: Plugin
  $.fn.xc1Slider = function(options) {
    return this.each(function() {
      if ($(this).find('ul > li').length != 1 && $(this).data('loaded') != true) {
        loadSlider($(this), options);
      } else if($(this).find('ul > li').length != 1) {
	    restartSlider($(this), options); 
      } else  {
	  	$(this).find('ul > li').fadeIn();
      }
    });
  }  
  
})(jQuery);



