$(document).ready(function(){

	var key = '7b1368749ecac0e51e4b8178535068a5'

	$.ajax({
		dataType: 'json',
		url: 'http://gateway.marvel.com:80/v1/public/characters?orderBy=name&apikey='+ key,
		success: function(data) {
			console.log(data);
			var html = "";
			for(var i = 0; i < data.data.results.length; i++){
				var char = data.data.results[i];
				if(char.series.items.length && char.thumbnail.extension){
				
				var series = char.series.items[0].resourceURI;
				html += "<div class='character' style='background-image: url(\""+char.thumbnail.path + "." + char.thumbnail.extension+ "\")' data-series='"+series+"'><span>"+char.name+"</span></div>";
			}
				
			}
			$('.characters').html(html);
		}
	});

});