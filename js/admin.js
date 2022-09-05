$(function(){
	var galleryData;
	console.log('go go go');

	function init(){
		loadData();
	}

	function loadData(){
		// console.log('loadData');
		var images;
		$.ajax({
            url: '../data/galleries.json',
            cache: false,
            dataType: 'json',
            success: function (data) {
                galleryData = data;
                console.log(galleryData);
            },
            complete: function (data) {
                // insertFunctionality();
                // loadSlider();
                // loadGalleries()
                for (var i = 0; i < galleryData.galleries.length; i++) {
                	$('#galleries').append('<li>'+galleryData.galleries[i].name+'</li>')
                }
            },
            error: function (error) {
                console.log("template failed to load");
                // alertBox("Oops, something went wrong. Please contact the site administrator. <br><strong>Sidebar failed</strong>", 'fail');
            }
        });

	}

	function insertGalleries(){
		$.ajax({
            url: '../templates/galleries.handlebars',
            cache: false,
            success: function (data) {
            	var template = Handlebars.compile(data)
            	
            	/*for (var i = 0; i < galleries.length; i++) {
            		// console.log(i);
            		var galName = galleries[i].name;
            		var menuHtml = '<h1><a href="#'+galName+'">'+galName+'</a></h1>'
            		Handlebars.registerPartial('galleryIndex', i.toString());
            		// console.log(galleries[i]);
            		var html = template(galleries[i])

            		$('#galleries').append(html)
            		$('#flyoutMenu .navWrap').append(menuHtml);

            		// console.log(menuHtml)
            	}*/
            },
            complete: function (data) {
                // insertFunctionality();
            },
            error: function (error) {
                console.log("template failed to load");
            }
        });
	}

	init()
})