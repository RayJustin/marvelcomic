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
							console.log(data);
							var series = data.data[0];

							html = '<div class="seriesCont"><a href="/series/'+ series.id +'"><div class="series" style="background-image: url('+ series.thumbnail.path + '.' + series.thumbnail.extension +')"><span>'+ series.title +'</span></div><span class="progress">Progress: 0/10</span><div class="meter"><span style="width: 0%"></span></div></a></div>"';
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
				var series = data.data[0];
				var title = series.title.split(" (");
				var comic = series.comics.items;
				$('.seriesName').text(title[0]);
				$('.seriesSm').css('background-image', 'url(\''+series.thumbnail.path+ '.' + series.thumbnail.extension + '\')');

				$.each(comic, function(index, value){
					var series = value.resourceURI.split("series/");
					var val = series[1];

						$.ajax({
							dataType: 'json',
							url: '/comic/'+ val,
							success: function(data){
								var comic = data.data[0];

								var html = '<div class="comicWrapper"><a href="/comic/'+ comic.id +'"><div class="comic" style="background-image: url('+ comic.thumbnail.path +'.'+ comic.thumbnail.extension +')"></div></a><input type="checkbox" id="cb'+ index +'" name="cb'+ index +'"><label for="cb'+ index +'">Read</label></div>';
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
				console.log(data);
				var comic = data.data[0];
				html = '<div class="comicLrg" style="background-image: url('+ comic.thumbnail.path +'.'+ comic.thumbnail.extension +')"></div>';

				$('.comicContainer').append(html);
				detail = '<li>Title: '+ comic.title +'</li><li>Issue: '+ comic.issueNumber +'</li><li>UPC: '+ comic.upc +'</li><li>Price: '+ comic.price +'</li>';
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







