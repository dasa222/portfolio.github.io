(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
  var CountTo = function (element, options) {
    this.$element = $(element);
    this.options  = $.extend({}, CountTo.DEFAULTS, this.dataOptions(), options);
    this.init();
  };

  CountTo.DEFAULTS = {
    from: 0,               // the number the element should start at
    to: 0,                 // the number the element should end at
    speed: 1000,           // how long it should take to count between the target numbers
    refreshInterval: 100,  // how often the element should be updated
    decimals: 0,           // the number of decimal places to show
    formatter: formatter,  // handler for formatting the value before rendering
    onUpdate: null,        // callback method for every time the element is updated
    onComplete: null       // callback method for when the element finishes updating
  };

  CountTo.prototype.init = function () {
    this.value     = this.options.from;
    this.loops     = Math.ceil(this.options.speed / this.options.refreshInterval);
    this.loopCount = 0;
    this.increment = (this.options.to - this.options.from) / this.loops;
  };

  CountTo.prototype.dataOptions = function () {
    var options = {
      from:            this.$element.data('from'),
      to:              this.$element.data('to'),
      speed:           this.$element.data('speed'),
      refreshInterval: this.$element.data('refresh-interval'),
      decimals:        this.$element.data('decimals')
    };

    var keys = Object.keys(options);

    for (var i in keys) {
      var key = keys[i];

      if (typeof(options[key]) === 'undefined') {
        delete options[key];
      }
    }

    return options;
  };

  CountTo.prototype.update = function () {
    this.value += this.increment;
    this.loopCount++;

    this.render();

    if (typeof(this.options.onUpdate) == 'function') {
      this.options.onUpdate.call(this.$element, this.value);
    }

    if (this.loopCount >= this.loops) {
      clearInterval(this.interval);
      this.value = this.options.to;

      if (typeof(this.options.onComplete) == 'function') {
        this.options.onComplete.call(this.$element, this.value);
      }
    }
  };

  CountTo.prototype.render = function () {
    var formattedValue = this.options.formatter.call(this.$element, this.value, this.options);
    this.$element.text(formattedValue);
  };

  CountTo.prototype.restart = function () {
    this.stop();
    this.init();
    this.start();
  };

  CountTo.prototype.start = function () {
    this.stop();
    this.render();
    this.interval = setInterval(this.update.bind(this), this.options.refreshInterval);
  };

  CountTo.prototype.stop = function () {
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  CountTo.prototype.toggle = function () {
    if (this.interval) {
      this.stop();
    } else {
      this.start();
    }
  };

  function formatter(value, options) {
    return value.toFixed(options.decimals);
  }

  $.fn.countTo = function (option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('countTo');
      var init    = !data || typeof(option) === 'object';
      var options = typeof(option) === 'object' ? option : {};
      var method  = typeof(option) === 'string' ? option : 'start';

      if (init) {
        if (data) data.stop();
        $this.data('countTo', data = new CountTo(this, options));
      }

      data[method].call(data);
    });
  };
	
	$.fn.isInViewport = function () {
		let elementTop = $(this).offset().top;
		let elementBottom = elementTop + $(this).outerHeight();

		let viewportTop = $(window).scrollTop();
		let viewportBottom = viewportTop + $(window).height();

		return elementBottom > viewportTop && elementTop < viewportBottom;
	};
}));



jQuery(document).ready(function($){
	$(".downloaddesktop").mouseover(function(){
		$(this).addClass("over")
	}).mouseout(function(){
		$(this).removeClass("over");
	})
	$('#home .privacy h1.title').scrollfire({
   		onScrollDown: function( elm ) {
        	$("#frontshield").addClass("slideclose");
    	},
    	onScrollUp: function( elm ) {
        	$("#frontshield").removeClass("slideclose");
    	},
	});
	$('#home .phone2 h1').scrollfire({
   		onScrollDown: function( elm ) {
        	$("#home .phone2").addClass("closephone2");
    	},
    	onScrollUp: function( elm ) {
        	$("#home .phone2").removeClass("closephone2");
    	},
	});
	$('#home .banner').scrollfire({
   		onScrollDown: function( elm ) {
        	$("#fiat1").addClass("closefiat");
    	},
    	onScrollUp: function( elm ) {
        	$("#fiat1").removeClass("closefiat");
    	},
	});
	$('.slider-single').slick({
	    slidesToShow: 1,
	    slidesToScroll: 1,
	    arrows: false,
	    dots: true,
	    fade: false,
	    adaptiveHeight: true,
	    infinite: false,
	    useTransform: true,
	    speed: 400,
	    cssEase: 'cubic-bezier(0.77, 0, 0.18, 1)',
	});

	$('.slider-nav')
	    .on('init', function(event, slick) {
	        $('.slider-nav .slick-slide.slick-current').addClass('is-active');
	    })
	    .slick({
	        slidesToShow: 5,
	        slidesToScroll: 5,
	        dots: false,
	        arrows: true,
	        focusOnSelect: false,
	        infinite: false,
	        prevArrow: "<button class='nav-prev'><img src='wp-content/themes/babb/images/right-arrow.png'></button>",
	        nextArrow: "<button class='nav-next'><img src='wp-content/themes/babb/images/right-arrow.png'></button>",
	        responsive: [{
	            breakpoint: 1024,
	            settings: {
	                slidesToShow: 5,
	                slidesToScroll: 5,
	            }
	        }, {
	            breakpoint: 640,
	            settings: {
	                slidesToShow: 4,
	                slidesToScroll: 4,
	            }
	        }, {
	            breakpoint: 420,
	            settings: {
	                slidesToShow: 3,
	                slidesToScroll: 3,
	        }
	        }]
	    });

	$('.slider-single').on('afterChange', function(event, slick, currentSlide) {
	    $('.slider-nav').slick('slickGoTo', currentSlide);
	    var currrentNavSlideElem = '.slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
	    $('.slider-nav .slick-slide.is-active').removeClass('is-active');
	    $(currrentNavSlideElem).addClass('is-active');
	    
	    $(".select-nav .select-items").find("div.same-as-selected").removeClass("same-as-selected");
	    $(".select-nav .select-items").find("div:nth-child(" + (currentSlide*1 + 1) + ")").addClass("same-as-selected");
	    $(".select-nav .select-selected").text($(".select-nav .select-items").find("div:nth-child(" + (currentSlide*1 + 1) + ")").text());
	});

	$('.slider-nav').on('click', '.slick-slide', function(event) {
	    event.preventDefault();
	    var goToSingleSlide = $(this).data('slick-index');

	    $('.slider-single').slick('slickGoTo', goToSingleSlide);
	});

	$('.select-nav').on('click', '.select-items', function(event) {
	    event.preventDefault();
	    var goToSingleSlide = $(this).find("div.same-as-selected").index();

	    $('.slider-single').slick('slickGoTo', goToSingleSlide);
	});

	var x, i, j, l, ll, selElmnt, a, b, c;
	/*look for any elements with the class "select-nav":*/
	x = document.getElementsByClassName("select-nav");
	l = x.length;
	for (i = 0; i < l; i++) {
	selElmnt = x[i].getElementsByTagName("select")[0];
	ll = selElmnt.length;
	/*for each element, create a new DIV that will act as the selected item:*/
	a = document.createElement("DIV");
	a.setAttribute("class", "select-selected");
	a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
	x[i].appendChild(a);
	/*for each element, create a new DIV that will contain the option list:*/
	b = document.createElement("DIV");
	b.setAttribute("class", "select-items select-hide");
	for (j = 1; j < ll; j++) {
	    /*for each option in the original select element,
	    create a new DIV that will act as an option item:*/
	    c = document.createElement("DIV");
	    c.innerHTML = selElmnt.options[j].innerHTML;
	    c.addEventListener("click", function(e) {
	        /*when an item is clicked, update the original select box,
	        and the selected item:*/
	        var y, i, k, s, h, sl, yl;
	        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
	        sl = s.length;
	        h = this.parentNode.previousSibling;
	        for (i = 0; i < sl; i++) {
	        if (s.options[i].innerHTML == this.innerHTML) {
	            s.selectedIndex = i;
	            h.innerHTML = this.innerHTML;
	            y = this.parentNode.getElementsByClassName("same-as-selected");
	            yl = y.length;
	            for (k = 0; k < yl; k++) {
	            y[k].removeAttribute("class");
	            }
	            this.setAttribute("class", "same-as-selected");
	            break;
	        }
	        }
	        h.click();
	    });
	    b.appendChild(c);
	}
	x[i].appendChild(b);
	a.addEventListener("click", function(e) {
	    /*when the select box is clicked, close any other select boxes,
	    and open/close the current select box:*/
	    e.stopPropagation();
	    closeAllSelect(this);
	    this.nextSibling.classList.toggle("select-hide");
	    this.classList.toggle("select-arrow-active");
	    });
	}
	function closeAllSelect(elmnt) {
	/*a function that will close all select boxes in the document,
	except the current select box:*/
	var x, y, i, xl, yl, arrNo = [];
	x = document.getElementsByClassName("select-items");
	y = document.getElementsByClassName("select-selected");
	xl = x.length;
	yl = y.length;
	for (i = 0; i < yl; i++) {
	    if (elmnt == y[i]) {
	    arrNo.push(i)
	    } else {
	    y[i].classList.remove("select-arrow-active");
	    }
	}
	for (i = 0; i < xl; i++) {
	    if (arrNo.indexOf(i)) {
	    x[i].classList.add("select-hide");
	    }
	}
	}
	/*if the user clicks anywhere outside the select box,
	then close all select boxes:*/
	document.addEventListener("click", closeAllSelect);
	let lastScrollTop = 0
	var clickedSubDot = false
	$(function() {
		$(window).fadeThis({reverse: false, speed: 300, offset: -500})
		$(window).scroll(function () {
			if ($('.app-status').length > 0) {
				if ($('.app-status').isInViewport()) {
					if (!$('.app-status').hasClass('test')) {
						$('.counter').each(function() {
							$(this).countTo({
								from: 0,
								to: $(this).text(),
								speed: 1000,
								refreshInterval: 50,
								decimals: $(this).data("decimal"),
								formatter: function (value, options) {
								return value.toFixed(options.decimals);
								},
								onUpdate: function (value) {
								},
								onComplete: function (value) {
								}
							});
						})
					}
					$('.app-status').addClass('test');
				} 
			}
			 var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
			
            if (st > lastScrollTop){
                $("header.notroadmap").removeClass("show");
                $(".notroadmap #content").css("padding-top", "0")
            } else {
                $("header.notroadmap").addClass("show");
                $(".notroadmap #content").css("padding-top", "78px")
                // upscroll code
            }
            lastScrollTop = st <= 0 ? 0 : st;
		});
		
		$( ".accordion" ).accordion({
			heightStyle: "content"
		});
	})
});