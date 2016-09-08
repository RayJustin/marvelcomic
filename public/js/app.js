$(document).ready(function(){

	// AJAX call to get CHARACTERS //
	$.ajax({
		dataType: 'json',
		url: '/characters',
		success: function(data) {
			var html = "";
			for(var i = 0; i < data.length; i++){
				var char = data[i];
			
					html += '<a href="/character/'+ char.charID +'"><div class="character" style="background-image: url('+ char.thumbnail +')"></div></a>';
			}
			$('.characterCont').html(html);
		}
	});

	// AJAX call to get SERIES //
	$('.characterCont').on('click','a',function(e){
		e.preventDefault();
		var href = $(this).attr('href');

		$('.characterCont').hide();

		$.ajax({
			dataType: 'json',
			url: href,
			success: function(data){
				$('.characterName').text(data[0].name);
				$('.characterHead').css('background-image', 'url('+data[0].thumbnail +')');

				$.each(data[0].series, function(index, value){
					var html = "";

					$.ajax({
						dataType: 'json',
						url: '/series/' + value,

						success: function(data) {
							var series = data[0];

							html = '<div class="seriesCont"><a href="/series/'+ data.seriesID +'"><div class="series" style="background-image: url('+ data.thumbnail +')"><span>'+ data.name +'</span></div><span class="progress">Progress: 0/10</span><div class="meter"><span style="width: 0%"></span></div></a></div>"';
							$('.seriesSection').append(html);
						}
					});
				});
			}
		});
		$('.characterDetail').show();
	});

	// AJAX call to get COMICS //
	$('.seriesSection').on('click', 'a', function(e){
		e.preventDefault();
		var series = $(this).attr('href');
		$('.characterDetail').hide();
		var html = "";

		$.ajax({
			dataType: 'json',
			url: series,
			success: function(data){

				var title = data.name.split(" (");
				var comic = data.comics;
				$('.seriesName').text(title[0]);
				$('.seriesSm').css('background-image', 'url('+ data.thumbnail +')');

				$.each(comic, function(index, value){

					// AJAX call to get a single COMIC //
						$.ajax({
							dataType: 'json',
							url: '/comic/'+ value,
							success: function(data){

								var html = '<div class="comicWrapper"><a href="/comic/'+ data.comicID +'"><div class="comic" style="background-image: url('+ data.thumbnail +')"><span>'+ data.name +'</span></div></a><input type="checkbox" id="cb'+ index +'" name="cb'+ index +'"><label for="cb'+ index +'">Read</label></input></div>';
								$('.comicCont').append(html);
							}
						});
				});
			}
		});
		$('.seriesDetail').show();
	});

	$('.comicCont').on('click', 'a', function(e){
		e.preventDefault();
		$('.seriesDetail').hide();
		comic = $(this).attr('href');
		var html = "";
		var detail = "";

		$.ajax({
			dataType: 'json',
			url: comic,
			success: function(data) {

				html = '<div class="comicLrg" style="background-image: url('+ data.thumbnail +')"></div><input type="checkbox" id="cb" name="cb"><label id="check" for="cb">Read</label></input>';
				$('.comicContainer').append(html);

				detail = '<li>Title: '+ data.title +'</li><li>Issue: '+ data.issueNumber +'</li><li>UPC: '+ data.upc +'</li><li>Price: '+ data.price +'</li>';
				$('.comicDetail').append(detail);
			}
		});
		$('.comicOverview').show();
	});

	// Check boxes need to change the border color //
	$('.comicWrapper').on('click', 'label', function(){
		$(this).toggleClass('checked');
	});

});







