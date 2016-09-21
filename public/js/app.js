$(document).ready(function(){
	// Just handles the style changes to the Read buttons
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