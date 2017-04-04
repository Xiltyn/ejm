// on document ready
(function($, _) {

 	// show/hide the mobile menu based on class added to container
	$('.menu-icon').click(function(){
		$(this).parent().toggleClass('is-tapped');
		 return false;
	});

//scroll na buttonach
	$('a[href^="#"]').on('click', function(event) {
	    var target = $(this.getAttribute('href'));
	    if( target.length ) {
	        event.preventDefault();
	        $('html, body').stop().animate({
	            scrollTop: target.offset().top - 50
	        }, 800);
	    }
	});

  	// handle touch device events on drop down, first tap adds class, second navigates
 	$('.touch .sitenavigation li.nav-dropdown > a').on('touchend',
		function(e){
	    if ($('.menu-icon').is(':hidden')) {
		  	var parent = $(this).parent();
			  $(this).find('.clicked').removeClass('clicked');
	 			if (parent.hasClass('clicked')) {
					 window.location.href = $(this).attr('href');
				} else {
	 				$(this).addClass('linkclicked');

          // close other open menus at this level
	 			  $(this).parent().parent().find('.clicked').removeClass('clicked');

          parent.addClass('clicked');
					e.preventDefault();
				}
			}
	});

 	// handle the expansion of mobile menu drop down nesting
   	$('.sitenavigation li.nav-dropdown').click(
  		function(event){
  			if(event.stopPropagation) {
  				event.stopPropagation();
  			} else {
  				event.cancelBubble = true;
  			}

  			if ($('.menu-icon').is(':visible')) {
  				$(this).find('> ul').toggle();
  				$(this).toggleClass('expanded');
  			}
  		 }
  	);


  	// prevent links for propagating click/tap events that may trigger hiding/unhiding
  	$('.sitenavigation a.nav-dropdown, .sitenavigation li.nav-dropdown a').click(
  		function(event){
 			if(event.stopPropagation) {
 				event.stopPropagation();
 			} else {
 				event.cancelBubble = true;
 			}
  		}
  	);

  	// javascript fade in and out of dropdown menu
  	$('.no-touch .sitenavigation li').hover(
	  	function() {
	  		if (!$('.menu-icon').is(':visible')) {
	  		 	$(this).find('> ul').fadeIn(150);
	  		}
	  	},
	  	function() {
	  		if (!$('.menu-icon').is(':visible')) {
	  			 $(this).find('> ul').fadeOut(150);
	  		}
	  	}
  	);

// AJAX GALLERY LOADER

function injectGallery() {
	var	$btn = $('.kk');

	function selectCategory(data) {
		var miniatures;
		var $objects         = Array.prototype.slice.call(data.gallery);
		console.log($objects);

		$btn.on('click', function() {
			var $th = $(this);
			var $thCat = $th.attr('data-category');
			var $template        = _.template($('#galleryTemplate').html());
			var $wrapper          = $('#galleryAjax');
			var $fragment        = $(document.createDocumentFragment());

			$wrapper.html('');
			// console.log($objects);
			$objects.forEach(function(element) {
				var elCategory = element.category
				console.log(elCategory);
				if ($thCat == elCategory) {
					$fragment.append($template({
						name: element.name,
						category: element.category,
						src: element.images[0],
						title: element.name,
						description: element.description
					}));
				}
			});
			$wrapper.append($fragment);

			miniatures = $('.gallery-item');
			initiateLightbox(miniatures);
		})
	}
	// AJAX deprecated call
	// ==========================================================::||:>
	$.when($.ajax('data.json')).then(success, failure);

	// Callback function called when objects are successfully loaded
	// ==========================================================::||:>
	function success(success) {
		console.log('Yes! Success!');
		selectCategory(success);
    showOverlay();
	}

	function failure() {
		console.log('Whooops! Something went wrong with loading the JSON file data for S K I L L S!');
	}
}


  // ============================================================::||:>
  // ========================== LIGHTBOX ========================::||:>

  function initiateLightbox(input) {
    let $miniature = input
    let $lightbox = $('.dp-lightbox')
    let $lightboxImage = $lightbox.find('.image')
    let $nav = $('.dp-lightbox .nav .nav-btn')
    let $dim = $('.dim')
    let inactive = {'opacity': 0, 'pointer-events': 'none'}
    let active = {'opacity': 1, 'pointer-events': 'all'}
    let visible = {'opacity': 1}
    let dimmed = {'opacity': 0.8, 'pointer-events': 'all'}


    $miniature.on('click', function() {
      let $th = $(this)
      let imageSrc = $th.find('img').attr('src')
			let fileName = imageSrc.split('/')[3]
      let container = $lightboxImage
		 	let overlay = $th.find('.overlay')
			let title = overlay.find('h2').text();
			let description = overlay.find('p').text();
      console.log(container)
      appendImage(fileName, title, description, container)
      $dim.css(dimmed)
      $lightbox.css(visible)
      $lightboxImage.css(active)
      $nav.css(active)

      initiateNav($th)
    })

    $dim.on('click', function() {
      $dim.css(inactive)
      $lightbox.css(inactive)
      $lightboxImage.css(inactive)
      $nav.css(inactive)
    })

    function appendImage(fileName, title, description, container) {
			container.html('<img src="images/gallery/' + fileName + '"/><h2>' + title + "</h2><p>" + description + "</p>");
    }

    function initiateNav(focus) {
      let $prevBtn = $('.nav-btn--left')
      let $nextBtn = $('.nav-btn--right')
      let container = $lightboxImage


			$prevBtn.on('click', function() {
				let prev = focus.parent('.image').prev()
				if (prev.length !== 0) {
	        let prevImageSrc = prev.find('img').attr('src')
					let fileName = prevImageSrc.split('/')[3]
          let prevOverlay = prev.find('.overlay')
          let title = prevOverlay.find('h2').text()
          let description = prevOverlay.find('p').text()

          appendImage(fileName, title, description, container)
          focus = prev.find('.gallery-item')
        }
      })

      $nextBtn.on('click', function() {
        let next = focus.parent('.image').next()
        if (next.length !== 0) {
					let nextImageSrc = next.find('img').attr('src')
					let fileName = nextImageSrc.split('/')[3]
          let nextOverlay = next.find('.overlay')
          let title = nextOverlay.find('h2').text()
          let description = nextOverlay.find('p').text()

          appendImage(fileName, title, description, container)
          focus = next.find('.gallery-item')
        }
      })

    }

  }

  // ======================== END LIGHTBOX ======================::||:>
  // ============================================================::||:>
// function render(data) {
// 	var $template        = _.template($('#galleryTemplate').html());
// 	var $wrapper          = $('#galleryAjax');
// 	var $objects         = Array.prototype.slice.call(data.gallery);
// 	var $fragment        = $(document.createDocumentFragment());
//
//
// 	// console.log($objects);
// 	$objects.forEach(function(element) {
// 			$fragment.append($template({
// 				name: element.name,
// 				category: element.category,
// 				src: element.images[0]
// 			}));
// 	});
//
// 	$wrapper.append($fragment);
// };



// Callback function called when objects fail to be loaded
// ==========================================================::||:>

  function showOverlay() {
    let overlay = $('img');
    let active = {
      opacity: 1,
    };
    let inactive = {
      opacity: 0,
    };
    console.log('shit')

    overlay.on('mousemove', function() {
      let $th = $(this);

      console.log('entered')

      $th.css(active);
    })

    overlay.on('mouseleave', function() {
      let $th = $(this);

      console.log('left')

      $th.css(inactive);
    })

  }




injectGallery();




	})(window.$, window._);
