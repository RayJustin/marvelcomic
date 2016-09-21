var express = require('express');
var port = process.env.PORT || 8080;
var mongoose= require('mongoose');
var passport= require('passport');
var flash = require('connect-flash');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

var app = express();
app.use(express.static('public'));

// Config
mongoose.connect(configDB.url);

// Require Passport Later
require('./config/passport')(passport);

// Setup Express App
app.use(cookieParser()); // Read Cookies for Authentication
app.use(bodyParser()); // Get Info From Form

app.set('view engine', 'ejs'); 

// Required for Passport
app.use(session({ secret: 'jdev' }));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); // Flash Messages

// Routes
require('./app/routes.js')(app, passport); // Routes

// How is this going to work when pushed to Heroku??
// app.get('/characters/:offset', function(req, res){
// 	var offset = req.params.offset * 20;
// 	marvel.characters.findAll(20,offset,function(err, results) {
// 	  if (err) {
// 	    return res.sendStatus(err);
// 	  }
// 	 // loop over results to see if they are in the database, if not add them
// 	  for (var i = 0; i < results.data.length; i++) {
// 	  	var char = results.data[i];
// 	  	if(char.series.items.length && char.thumbnail.extension){
// 		  	var series = [];
// 		  	for (var j = 0; j < char.series.items.length; j++) {
// 		  		var seriesid = char.series.items[j].resourceURI.split('series/');
// 		  		series.push(seriesid[1]);
// 		  	}
// 		  	Character.create({
// 		  		name: char.name,
// 		  		charID: char.id,
// 		  		thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
// 		  		numOfComics: char.comics.available,
// 		  		numOfSeries: char.series.available,
// 		  		series: series
// 		  	}, function(err,character){
// 		  		if(err){
// 		  			return res.status(500).json({
// 		  				message: 'Error '+err
// 		  			});
// 		  		}
// 		  	});
// 		}
// 	  }
// 	  res.json(results);
// 	});
// });

app.listen(process.env.PORT || 8080, function(){
	console.log('Listening on Port: 8080');
});