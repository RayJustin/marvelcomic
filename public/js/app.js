$(document).ready(function(){

	$.ajax({
		dataType: 'json',
		url: '/characters',
		success: function(data) {
			// console.log(data)
			var html = "";
			for(var i = 0; i < data.data.length; i++){
				var char = data.data[i];
				if(char.series.items.length && char.thumbnail.extension){
				
				var series = char.series.items[0].resourceURI;
				html += '<a href="/character/'+char.id+'">'+
							'<div class="character" style="background-image: url(\''+char.thumbnail.path+ '.' + char.thumbnail.extension + '\')">'+
						'</div>'+
						'</a>';
			}
				
			}
			$('.characterCont').html(html);
		}
	});

	$('.characterCont').on('click','a',function(e){
		e.preventDefault();
		var char = $(this).attr('href');
		$('.characterCont').hide();

		$.ajax({
			dataType: 'json',
			url: char,
			success: function(data){
				console.log(data);
				$('.characterName').text(data.data[0].name);
			}
		});

		$('.characterDetail').show();
	});

});