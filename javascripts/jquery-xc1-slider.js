/*
 * Carousel
 */
(function($){
	$.fn.xc1Slider = function () {
		
		// Append the extra
			//Wrap the slider in 
			$('ul', this).wrap('<div id="slider-container" />');
			// Append the manual next and prev
			$(this).append('<div id="slider-manual-nav-container"></div>');
			// Append the manual nav 
			$(this).append('<div id="slider-manual-container"><ul id="slider-nav-ul"><li id="left-arrow"><a class="back" href="#" title="Previous">&lt;</a></li><li id="right-arrow"><a class="forward" href="#" title="Next">&gt;</a></li></ul></div>');
			
		/*
		 * Manual navigation
		 */
		$("ul#slider-manual-nav a").live('click', function () {
			var navVal = $(this).attr("href");
			
			$('#slider-manual-nav li a.active').removeClass('active');
			
			$(this).addClass('active');
			navVal = navVal.replace('#', '');
			$('#slider-container').trigger('goto', parseInt(navVal, 10)); // Needs fixxx
			
			return false;
		});
		
		/*
		 * Add all links to the manual navigation area
		 */
		var listcount = $(this).find('> ul').find('> li').size(),
			appendlist = '';
		
		for (i = 1; i <= listcount; i++) {
			appendlist = appendlist + '<li><a href="#'+i+'" ' + (i==1?'class="active"':'') + '>i</a></li>';
		}
		
		$('#slider-manual-nav-container').append('<ul id="slider-manual-nav">'+appendlist+'</ul>');
		
	    function repeat(str, num) {
	        return new Array( num + 1 ).join( str );
	    }
  
	    return this.each(function () {
	        var $wrapper = $('#slider-container'),
	            $slider = $wrapper.find('> ul'),
	            $items = $slider.find('> li'),
	            $single = $items.filter(':first'),
            
	            singleWidth = $single.outerWidth(), 
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
					$("#slider-manual-nav li a.active").removeClass("active");
					$("ul#slider-manual-nav li:nth-child("+currentPage+") a").addClass("active");
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
	};
})(jQuery);



