$(document).ready(function(){

	$('.comicCont').on('click', '.readButton', function(e){
  		e.preventDefault();
  		var button = $(this);
  		$.ajax($(this).attr('href')).done(function(){
 			button.toggleClass('read');
		});
	});

	$('.comicContainer').on('click', '.readButtonLrg', function(e){
  		e.preventDefault();
  		var button = $(this);
  		$.ajax($(this).attr('href')).done(function(){
 			button.toggleClass('read');
		});
	});
});