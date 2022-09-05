/*global $, window, i*/

"use strict";

$(document).ready(function () {
	var manifest;
	var apiRoot = "https://api.smugmug.com";
	var apikey = "?APIKey=HNt9hQQBLj5ftr6kvqMLJFhDh4PtkHxx";
	// var apikey = "";
	var galleries = []
	var galleryCount = 0;
	var slider;
	var portfolio = []
	var screenWidth = $(window).width();
	var newScreenWidth
	var sliderAnimation;

	// console.log(screenWidth);

	function init(){

		// loadData();

		// console.log(y);

		// insertFunctionality()

		getAlbums()
	}

	function getAlbums(){
		
		var portfolioNode = "/api/v2/node/qB8ZpZ!children"
		var sliderAlbum = "album/TkQHFf!images";
		var folderPath = "folder/user/keilenphotography/Portfolio!albums"
		$.ajax({
            url: apiRoot + portfolioNode + apikey,
            cache: false,
            dataType: 'json',
            success: function (data) {
            	
            	manifest = data.Response;
            	console.log(manifest)
                
                for (var i = 0; i < manifest.Node.length; i++) {
                	var albumName = manifest.Node[i].Name
                	// var albumNode = portfolio.Node[i].NodeID
                	var albumPath = manifest.Node[i].Uris.Album.Uri + '!images'

                	portfolio.push({
                		'name': albumName,
                		'path': albumPath
                	})
                }
            },
            complete: function (data) {
                console.log(portfolio)
                for (var i = 0; i < portfolio.length; i++) {
					getImages(portfolio[i])
				}

            },
            error: function (error) {
                // console.log("template failed to load");
                // alertBox("Oops, something went wrong. Please contact the site administrator. <br><strong>Sidebar failed</strong>", 'fail');
            }
        });

	}

	function getImages(array){
		var albumName = array.name
		var url = array.path
		// var images;
		// console.log(name, apiRoot+path)
		$.ajax({
            url: apiRoot + url + apikey,
            cache: false,
            dataType: 'json',
            success: function (data) {
            	array.images = data.Response.AlbumImage            
            },
            complete: function (data) {
                if (albumName == "Slider") {
                	slider = array.images
                	loadSlider()
                } else {
                	console.log('fire off the gallery')
                	loadGalleries(array)
                }

            },
            error: function (error) {
                console.log("template failed to load");

            }
        });
	}

	/*function loadData(){
		// console.log('loadData');
		var images;
		$.ajax({
            url: './data/galleries.json',
            cache: false,
            dataType: 'json',
            success: function (data) {
            	
                images = data;
                galleries = images.galleries;
				slider = images.slider;

            },
            complete: function (data) {
                // insertFunctionality();
                loadSlider();
                loadGalleries()

            },
            error: function (error) {
                console.log("template failed to load");
                // alertBox("Oops, something went wrong. Please contact the site administrator. <br><strong>Sidebar failed</strong>", 'fail');
            }
        });

	}*/

	function loadSlider() {
		console.log(slider);
		for (var i = 0; i < slider.length; i++) {
			// console.log(slider[i].source);
			var source = slider[i].ArchivedUri;
			// console.log(source);
			var html = "<div class='slide' data-index='"+i+"' style='background-image: url("+source+");''></div><div class='slideBG' data-index='"+i+"' style='background-image: url("+source+");''></div>"
			$('#imageSlider').append(html);
		}
		initSlider();
	}

	function initSlider(){
		$('#imageSlider .slide[data-index="0"]').animate({
			opacity: 1
		}, 400)
		$('#imageSlider .slideBG[data-index="0"]').animate({
			opacity: .2
		}, 400)
		sliderAnimation = window.setInterval(nextSlide, 5500);
	}

	var currentSlide = 0;

	function nextSlide(){
		if (currentSlide == (slider.length - 1)) {
			currentSlide = 0
		} else {
			currentSlide ++
		}
		$('#imageSlider .slide[data-index!="'+currentSlide+'"], #imageSlider .slideBG[data-index!="'+currentSlide+'"]').animate({
			opacity: 0
		}, 400)

		$('#imageSlider .slide[data-index="'+currentSlide+'"]').animate({
			opacity: 1
		}, 400)

		$('#imageSlider .slideBG[data-index="'+currentSlide+'"]').animate({
			opacity: .2
		}, 400)
	}

	window.addEventListener('blur', function() {
           window.clearInterval(sliderAnimation)
    });
    window.addEventListener('focus', function() {
        sliderAnimation = window.setInterval(nextSlide, 5500);
    });

	

	function loadGalleries(gallery){
		console.log(gallery)

		$.ajax({
            url: './templates/galleries.handlebars',
            cache: false,
            success: function (data) {
            	var template = Handlebars.compile(data)
            	// console.log(data);

            	// console.log(galleries);
            	// for (var i = 0; i < galleries.length; i++) {
            		// console.log(i);
            		var galName = gallery.name;
            		if (galName != 'unassigned') {

	            		var menuHtml = '<h1><a href="#'+galName+'">'+galName+'</a></h1>'
	            		var html = template(gallery)

	            		$('#galleries').append(html)
	            		$('#flyoutMenu .navWrap').append(menuHtml);
            		}

            		// console.log(menuHtml)
            	// }
            },
            complete: function (data) {
            	galleryCount ++
                // console.log(galleryCount, portfolio.length - 1)
                if (galleryCount == (portfolio.length - 1)) {
                	console.log(galleryCount, portfolio.length - 1)
                	insertFunctionality();
                }

            },
            error: function (error) {
                console.log("template failed to load");
            }
        });
	}

	function insertFunctionality(){
		// console.log('insertFunctionality');
		checkMobile();
		scrollTo('html');
		
		var d = new Date();
    	var y = d.getFullYear().toString()

    	$('footer .currentYear').text(y)

		// MODAL CRAP
		$(document).on('click', '.modalClose', function(e){
			
			$(this).closest('.modal').fadeOut(200);
			$('#modals').fadeOut(200);
		})

		$(document).on('click', '.contact', function(){
			$('#modals, #contactForm').fadeIn(200);
			menuClose();
		})

		function imageLoad(){
			var count = $('.item').length;
			var load = 0;

			$('.item').on('load', function(){
				load ++
				if (load == count) {
					initSwipebox();
				}
			})
		}

		imageLoad();

		function checkMobile(){
			newScreenWidth = $(window).width();
			if ( $(document).width() < 667) {
		    	$('.swipebox').hide()
			    $('section').each(function(){
			    	var count = 5;
			    	for (var i = 0; i < count; i++) {
			    		$(this).find('.swipebox').eq(i).show()
			    	}
			    })
			} else {
				$('.swipebox').show()
			}
		}

		function initSwipebox(){
			$( '.swipebox' ).swipebox();
		}

		$(document).on('click', '#toolMenu', function(e){
			$('#flyoutCover').fadeIn(200)
			$('#flyoutMenu').animate({
				'right': '0'
			}, 200)
		})

		$(document).on('click', '.menuClose', function(){
			menuClose();
		})

		$(document).on('click touchend', '.showMore', function(e){
			e.preventDefault()
			e.stopPropagation()

			// console.log('showmore trigger');
			var target = $(this).attr('data-target');

			$(this).toggleClass('show');
			
			if ($(this).hasClass('show')) {
				$('#' + target + ' .swipebox').show()
				$(this).find('span').text('Hide')
			} else {
				$(this).find('span').text('Show more')
				$('#' + target).find('.swipebox').each(function(){
					$(this).hide()
				})

		    	var count = 5;
		    	for (var i = 0; i < count; i++) {
			    	$('#' + target).find('.swipebox').eq(i).show()
			    }

			    scrollTo($('#' + target).find('.swipebox').eq(2))
			}
		})

		$(document).on('click', '.mainLogo', function(){
			scrollTo('html')
		})

		$(document).on('click', '#flyoutMenu a', function(e){
			e.preventDefault()
			scrollTo($(this).attr('href'))
			menuClose();
		})

		function menuClose(){
			$('#flyoutCover').fadeOut(200)
			$('#flyoutMenu').animate({
				'right': '-400px'
			}, 200)
		}

		function scrollTo(hash) {
			$('html, body').animate({
				scrollTop: $(hash).offset().top
			}, 400);
		}

	}


	init();
})