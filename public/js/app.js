$(document).ready(function(){

	// AJAX call to get CHARACTERS //
	$.ajax({
		dataType: 'json',
		url: '/characters',
		success: function(data) {
			var html = "";
			for(var i = 0; i < data.data.length; i++){
				var char = data.data[i];
				if(char.series.items.length && char.thumbnail.extension){
					html += '<a href="/character/id/'+char.id+'">'+
							'<div class="character" style="background-image: url(\''+char.thumbnail.path+ '.' + char.thumbnail.extension + '\')">'+'</div>'+'</a>';
				}
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
				var series = data.data[0].series.items;
				$('.characterName').text(data.data[0].name);
				$('.characterHead').css('background-image', 'url(\''+data.data[0].thumbnail.path+ '.' + data.data[0].thumbnail.extension + '\')');

				$.each(series, function(index, value){
					var title = value.name.split(" (");
					var html = "";

					$.ajax({
						dataType: 'json',
						url: '/series/' + title[0],
						success: function(data) {
							var char = data.data[0];
							html = '<div class="seriesCont"><a href="/series/id/'+ char.id +'"><div class="series" style="background-image: url('+ char.thumbnail.path + '.' + char.thumbnail.extension +')"></div><span class="progress">Progress: 0/10</span><div class="meter"><span style="width: 0%"></span></div></a></div>"';
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
		var char = $(this).attr('href');
		$('.characterDetail').hide();
		var html = "";

		$.ajax({
			dataType: 'json',
			url: char,
			success: function(data){
				var char = data.data[0];
				var title = char.title.split(" (");
				var comic = char.comics.items;
				$('.seriesName').text(title[0]);
				$('.seriesSm').css('background-image', 'url(\''+char.thumbnail.path+ '.' + char.thumbnail.extension + '\')');

				$.each(comic, function(index, value){
					var id = value.resourceURI.split("/");
					var val = id[id.length - 1];

						$.ajax({
							dataType: 'json',
							url: '/comic/'+ val,
							success: function(data){
								var char = data.data[0];
								console.log(data);

								var html = '<a href="/comic/ '+ char.id +'"><div class="comic" style="background-image: url('+ char.thumbnail.path +'.'+ char.thumbnail.extension +')"></div></a>';
								$('.comicCont').append(html);
							}
						});
				});
			}
		});
		$('.seriesDetail').show();
	});


});


