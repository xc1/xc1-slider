(function($){

  // xc1Slider
  $.xc1Slider = function(slider, options) {
	alert('We got a winner!');
	
	slider.vars = $.extend({}, $.xc1Slider.defaults, options);
	slider.load = {
		varWidth: 0,
		varHeight: 0,
		varPos: 0,
		varPosMin: 0,
		varPosMax: 0,
		varInterval: ''
	};
	
	/* Vars */
	
/*
	var xc1SliderContainer = infiniteSlider.parent();
	var infiniteSliderItems = infiniteSlider.children();
	var infiniteSliderLoaded = infiniteSlider.data('loaded');
	
*/
	
	// IE Fixx
	var infiniteVarIE = false;
	if($('html').hasClass('ie')) { sliderVarIE = true; }	
	
	/* Functions */
	
	load();
	
	// Load everything first time
	function load() {
		//Wrap the slider in 
		slider.find('ul').wrap('<div class="slider-container" />');		
		// Append the manual nav
		slider.append('<div class="slider-nav-container"><ul class="slider-nav-pagination"></ul><ul class="slider-nav-direction"><li class="slider-nav-left"><a href="#" title="Previous">&lt;</a></li><li class="slider-nav-right"><a href="#" title="Next">&gt;</a></li></ul></div>');
		

		
		// Set the slider as loaded
		slider.data('loaded', 'true');
	}

	// Navigations
	function nav() {
		
	}



	
	// Functions
	function forward(speed) {
		clearInterval(infiniteVarInterval);
		infiniteVarInterval = setInterval(function() {
			if(!infiniteVarIE) {
				infiniteSlider.attr('style', 'width: ' + infiniteVarWidth*6 + 'px; -moz-transform: translate3d(-' + infiniteVarPos +'px, 0, 0); -webkit-transform:translate3d(-' + infiniteVarPos +'px,0,0); transform:translate3d(-' + infiniteVarPos +'px,0,0);');
			} else {
				infiniteSlider.css({'left' : '-' + infiniteVarPos + 'px'});
			}
			
			if (infiniteVarPos >= infiniteVarPosMin && infiniteVarPos <= infiniteVarPosMax) {
				infiniteVarPos++;
			} else {
				infiniteVarPos = infiniteVarPosMin;
			}
			infiniteVarDirection = 'forward';
		}, infiniteSpeed/speed);
	}

	function backward(speed) {
		clearInterval(infiniteVarInterval);
		infiniteVarInterval = setInterval(function() {
			if(!infiniteVarIE) {
				infiniteSlider.attr('style', 'width: ' + infiniteVarWidth*6 + 'px; -moz-transform: translate3d(-' + infiniteVarPos +'px, 0, 0); -webkit-transform:translate3d(-' + infiniteVarPos +'px,0,0); transform:translate3d(-' + infiniteVarPos +'px,0,0);');
			} else {
				infiniteSlider.css({'left' : '-' + infiniteVarPos + 'px'});
			}
			
			if (infiniteVarPos >= infiniteVarPosMin && infiniteVarPos <= infiniteVarPosMax) {
				infiniteVarPos--;
			} else {
				infiniteVarPos = infiniteVarPosMax;
			}
			infiniteVarDirection = 'backward';
		}, infiniteSpeed/speed);
	}
	
	function pause() {
		clearInterval(infiniteVarInterval);
	}

	function resume() {
		if(infiniteAuto == true) {
			if(infiniteVarDirection == 'forward') {
				infiniteForward(1);		
			} else {
				infiniteBackward(1);
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
			//var infiniteVarPause = $('<div class="infinite-scroll-pause"></div>');
			var infiniteVarForward = $('<div class="infinite-scroll-forward"></div>');
			var infiniteVarBackward = $('<div class="infinite-scroll-backward"></div>');
			var infiniteVarPause = infiniteSliderItems;
			
			// Append navigation
			//infiniteSliderContainer.append(infiniteVarPause);
			infiniteSliderContainer.append(infiniteVarForward);
			infiniteSliderContainer.append(infiniteVarBackward);
			
			// Bind the Navigation
			infiniteVarPause.on('mouseover', function() { infinitePause(); }).on('mouseout', function() { infiniteResume(); });
			infiniteVarForward.on('mouseover', function() { infiniteForward(4); }).on('mouseout', function() { infiniteResume(); });
			infiniteVarBackward.on('mouseover', function() { infiniteBackward(4); }).on('mouseout', function() { infiniteResume(); });
			
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
			infiniteVarWidth = Math.round(infiniteVarWidth + $(this).width());
		});
		infiniteSlider.css({'width' : infiniteVarWidth*6 + 'px'});
		
		// Set Positions
		infiniteVarPosMax = infiniteVarWidth*4;
		infiniteVarPosMin = infiniteVarWidth*2;
		
		// Start the slider on init
		if(infiniteAuto == true && !infiniteSliderLoaded) {
			infiniteForward(1);
		}
			
				
	
	}

	
	
	*/
	
	
	
	
	
	
	
	
	
	
	
		// Append the extra
			//Wrap the slider in 
			$('ul', this).wrap('<div class="slider-container" />');
			// Append the manual next and prev links
			$(this).append('<div class="slider-manual-nav-container"><ul class="slider-manual-nav"></ul></div>');
			// Append the manual nav links
			$(this).append('<div class="slider-manual-container"><ul class="slider-nav-ul"><li class="left-arrow"><a class="back" href="#" title="Previous">&lt;</a></li><li class="right-arrow"><a class="forward" href="#" title="Next">&gt;</a></li></ul></div>');
		
		// Set the variables
		var $wrapper = $('#slider-container');
            $slider = $wrapper.find('> ul'),
            $items = $slider.find('> li'),
            $single = $items.filter(':first'),
		
		
		/*
		 * Manual navigation
		 */
		$("ul.slider-manual-nav a").on('click', function () {
			var navVal = $(this).attr("href");
			
			$('.slider-manual-nav li a.active').removeClass('active');
			
			$(this).addClass('active');
			navVal = navVal.replace('#', '');
			$slider.trigger('goto', parseInt(navVal, 10));
			
			return false;
		});
		
		/*
		 * Add all links to the manual navigation area
		 */
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
	}
  
  //xc1Slider: Defaults
  $.xc1Slider.defaults = {
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
  }
  
  //xc1Slider: Plugin
  $.fn.xc1Slider = function(options) {
    return this.each(function() {
      if ($(this).find('ul > li').length != 1 || $(this).data('loaded') != true) {
        new $.xc1Slider($(this), options);
      } else {
	  	$(this).find('ul > li').fadeIn();
      }
    });
  }  
  
})(jQuery);



