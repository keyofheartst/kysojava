
$('#contact-form').formValidation({
    framework: "bootstrap4",
    button: {
        selector: '#register-submit-btn',
        disabled: 'disabled'
    },
    locale: 'vi_VN',
    icon: null,
    fields: {
        name: {
            validators: {
                notEmpty: {
                    message: 'Họ tên là trường bắt buộc'
                },
                stringLength: {
                    max: 100,
                    message: 'Họ tên quá dài (<= 100 ký tự)'
                }
            }
        },
        Email: {
            validators: {
                notEmpty: {
                    message: 'Email là trường bắt buộc<br />'
                },
                stringLength: {
                    max: 50,
                    message: 'Email quá dài. Vui lòng sử dụng một địa chỉ ngắn hơn (<= 50 ký tự)<br />'
                },
                regexp: {
                    regexp: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
                    message: 'Địa chỉ Email không hợp lệ<br />'
                }
            }
        },
        phone: {
            validators: {
                notEmpty: {
                    message: 'Số điện thoại là trường bắt buộc<br />'
                },
                stringLength: {
                    max: 12,
                    message: 'Số điện thoại quá dài. Vui lòng kiểm tra lại (<= 12 số)<br />'
                }
            }
        },
        Message: {
            validators: {
                notEmpty: {
                    message: 'Lời nhắn là trường bắt buộc<br />'
                },
                stringLength: {
                    max: 250,
                    message: 'Lời nhắn quá dài (<= 250 ký tự)<br />'
                }
            }
        }
    },
    err: {
        clazz: 'invalid-feedback'
    },
    control: {
        // The CSS class for valid control
        valid: 'is-valid',

        // The CSS class for invalid control
        invalid: 'is-invalid'
    },
    row: {
        invalid: 'has-danger'
    }
}).on('err.field.fv', function (e, data) {
    data.fv.disableSubmitButtons(true);
}).on('success.field.fv', function (e, data) {
    var fields = $("form#contact-form :input:not(:hidden)");
    if (!required(fields)) {
        { $('#register-submit-btn').attr('disabled', 'disabled'); }
    }
    });

var required = function (fields) {
    var valid = true;
    fields.each(function () { // iterate all
        var $this = $(this);
        if (($this.is(':checkbox') && !$this.is(":checked")) || // checkbox
            (($this.is(':text') || $this.is('textarea')) && !$this.val()) || // text and textarea
            ($this.is(':radio') && !$('input[name=' + $this.attr("name") + ']:checked').length) ||
            ($this.is(':password') && !$this.val())) {
            valid = false;
        }
    });

    return valid;
}


/*-------------------------------------------------*/
/* =  preloader
/*-------------------------------------------------*/

$(window).load(function() { 
  $("#preloader").fadeOut("slow"); 
});




$(document).ready( function () {

  /*-------------------------------------------------*/
  /* =  HTML Nice croll
  /*-------------------------------------------------*/

  // $("html").niceScroll({
  //   autohidemode:false
  // });


  /*-------------------------------------------------*/
  /* =  scroll to top
  /*-------------------------------------------------*/

  var to_top_icon = $('#top');
    $(to_top_icon).hide();
        $(window).scroll(function(){
        if ($(this).scrollTop() > 75 ) {
        to_top_icon.fadeIn();
        } else {
        to_top_icon.fadeOut();
        }
    });

  /*-------------------------------------------------*/
  /* =  function initwatermark
  /*-------------------------------------------------*/


	function initWatermark() {
	    $.watermark.options = {
	        className: 'input--placeholder',
	        useNative: false
	    };

	    $("[placeholder]").each(function() {
	        $(this).watermark($(this).attr("placeholder"));
	    });
	    $("[type=password]").blur();
	}

	$('textarea').autosize();


	/*-------------------------------------------------*/
	/* =  function initwatermark
	/*-------------------------------------------------*/


	var window_height = $(window).height() ;

	$('#subheader, #subheader .rslides li ').css('height', window_height );


  // $('.filters').mouseover(function(){
  //   $('#menu-filter').show();
  //   $('#menu-filter li a').click(function(){
  //     $(this).parent().parent().hide();
  //     var text = $(this).html();
  //     $('.filters button').html(text);
  //     //add <b> element to .filter_wrap
  //     $('.filters button').append('<b></b>');
  //   });
  // });


	/*-------------------------------------------------*/
	/* =  on resize run function
	/*-------------------------------------------------*/


	var tOut = false;
	var milSec = 500;

	  $(window).resize(function(){
	   if(tOut !== false)
	      clearTimeout(tOut);
	   tOut = setTimeout(rsizeItems, milSec);
	});
	function rsizeItems() { 
	      //put code inside this function
	}


	/*-------------------------------------------------*/
	/* =  scroll on link
	/*-------------------------------------------------*/

  if ($(window).width() < 768) {
    var top_ofset = $('header').height() + 40;
  } 
  else {
    var top_ofset = $('header').height() + 91;
  } 

  // $(window).resize(function() {
  //   if($(window).width() < 768)  {
  //     top_ofset = $('header').height() + 40;
  //   }
  //   else {
  //     top_ofset = $('header').height() + 91;
  //   }
  //   $('header nav ul a,.findout-more ,.logo, .scroll-down').smoothScroll({
  //     offset: - top_ofset,
  //     // one of 'top' or 'left'
  //     direction: 'top',
  //     // only use if you want to override default behavior
  //     scrollTarget: null,
  //     // fn(opts) function to be called before scrolling occurs.
  //     // `this` is the element(s) being scrolled
  //     beforeScroll: function() {},
  //     // fn(opts) function to be called after scrolling occurs.
  //     // `this` is the triggering element
  //     afterScroll: function() {},
  //     easing: 'easeInOutExpo',
  //     speed: 1000,
  //     // coefficient for "auto" speed
  //     autoCoefficent: 2,
  //     // $.fn.smoothScroll only: whether to prevent the default click action
  //     preventDefault: true      
  //   });
  // });

	var top_ofset = $('header').height() + 40;


	$('header nav ul a,.findout-more ,.logo, .scroll-down, #top').smoothScroll({
      offset: - top_ofset,
      // one of 'top' or 'left'
      direction: 'top',
      // only use if you want to override default behavior
      scrollTarget: null,
      // fn(opts) function to be called before scrolling occurs.
      // `this` is the element(s) being scrolled
      beforeScroll: function() {},
      // fn(opts) function to be called after scrolling occurs.
      // `this` is the triggering element
      afterScroll: function() {},
      easing: 'easeInOutExpo',
      speed: 1000,
      // coefficient for "auto" speed
      autoCoefficent: 2,
      // $.fn.smoothScroll only: whether to prevent the default click action
      preventDefault: true      
    });


  [].slice.call( document.querySelectorAll( '.rslides_tabs' ) ).forEach( function( nav ) {
    new DotNav( nav, {
      callback : function( idx ) {
        //console.log( idx )
      }
    } );
  } );


  /*-------------------------------------------------*/
  /* =  scroll over 
  /*-------------------------------------------------*/


  var navigation = $('header');
  $(window).scroll(function() {
    if ($(window).scrollTop()>(window_height - 156)) {
      navigation.addClass('change');
      navigation.delay(1000).queue(function(){$(this).addClass('animate')
  });
    }
    else {
      navigation.removeClass('change animate');
    }
  });

  /*-------------------------------------------------*/
  /* =  Close navbar on click
  /*-------------------------------------------------*/

    $(".bars").click(function() {
      $("nav").toggleClass('active');
    });

    $('header nav a').click(function(){
      $(this).parent().parent().parent().removeClass('active');
    });


  /*-------------------------------------------------*/
  /* =  Close navbar on click
  /*-------------------------------------------------*/

  
  if ($(window).width() < 768) {    

      $('.filter').each(function(){
       $(this).attr('data-target', '#bs-example-navbar-collapse-2');
      }); 

    } 

  $(window).resize(function() {
    if($(window).width() < 768)  {
      $('.filter').each(function(){
       $(this).attr('data-target', '#bs-example-navbar-collapse-2');
      }); 
    }
    else {
      $('.filter').each(function(){
       $(this).attr('data-target', '');
      }); 
    }
  });




  /*-------------------------------------------------*/
  /* =  add text in button
  /*-------------------------------------------------*/


  $('#menu-filter .filter').on('click', function(){ 
      var text = $(this).html(); 
      $('.filters button').html(text);
 
  });



  /*-------------------------------------------------*/
  /* =  img to background
  /*-------------------------------------------------*/


  $(".white-popup img , .isotope-item >a >img,#subheader #slider1 img ").each(function(i, elem) {
    var img = $(elem);
    var div = $("<div />").css({
      background: "url(" + img.attr("src") + ") no-repeat",
      width: img.width() + "px",
      height: img.height() + "px"
    });
    img.replaceWith(div);
    $(div).addClass('browse-images')
  });






  /*-------------------------------------------------*/
	/* =  slider subheader
	/*-------------------------------------------------*/

 
	$("#slider1").responsiveSlides({
    nav: true,
    // random:true,
    prevText: "Previous",
    nextText: "Next", 
    pager: true
  });
  var wraper = '<div><img src="images/22.png" alt=""/></div>';
  var container_wrap = '<div class="container nav-container"></div>';
  // var next = '<span>NEXT SLIDE</span>';
  $('#subheader .rslides_tabs li').append ('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16"preserveAspectRatio="none"><circle cx="8" cy="8" r="6.215"/></svg>');
  $('#subheader .next').wrap('<div class="nav-circleslide"></div>');
  // $('#subheader .next').append(wraper,next,'NEXT SLIDE');
  $('#subheader .rslides_tabs').wrap(container_wrap);
  // $('#subheader .nav-circleslide').append(next);





  /*-------------------------------------------------*/
  /* =  slider follow
  /*-------------------------------------------------*/


  $("#slider3").responsiveSlides({
    nav: true,
    // random:true,
    prevText: "Previous",
    nextText: "Next", 
    pager: true
  });


  /*-------------------------------------------------*/
  /* =  validation
  /*-------------------------------------------------*/


    var word = ['one', 'two', 'three', 'four', 'five'];
    var rand = (Math.floor(Math.random() * 4));
    var correct = word[rand];
     console.log(correct);
     $('#test p span').html(correct);
     $('input[name=rand]').click(function() {
        $('input[name=rand]').parent().removeClass('active1');
        $('input[name=rand]:checked').parent().addClass('active1');
     });
     $('#btn').click(function() {
         $('.popup-email').fadeOut('fast');
     });
});








 
