var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var api = require('marvel-api');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/marvel');

mongoose.connection.on('error', function(err){
	console.error('Could not connect to DB:', err);
});

var Character = require('./public/models/character');

var app = express();
var server = http.Server(app);

var marvel = api.createClient({
  publicKey: '629306f6ee3a76a9edb4bf7f908c11fe', 
  privateKey: '298af9ed6d48e71b8224e7e53f68b335f2587274'
});

app.use(express.static('public'));

app.get('/characters', function(req, res){

	Character.find({show: 'Yes'}, function(err, data){
		if(err){
			return err;
		}
		res.json(data);
	});
});

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

app.get('/character/id/:id', function(req, res){
	// instead of calling API, call the database based on req.params.id
	marvel.characters.find(req.params.id,function(err, results) {
	  if (err) {
	    return res.sendStatus(err);
	  }
	  res.json(results);
	});
});

app.get('/series/:name', function(req, res){
	
	marvel.series.findByTitle(req.params.name, function(err, results){
		if(err){
			return res.sendStatus(err);
		}
		res.json(results);
	});
  	
});

app.get('/series/id/:id', function(req, res){

	marvel.series.find(req.params.id, function(err, results){
		if(err){
			return res.sendStatus(err);
		}
		res.json(results);
	});
});

app.get('/comic/:id', function(req, res){
	
	marvel.comics.find(req.params.id, function(err, results) {
	  if (err) {
	    return res.sendStatus(err);
	  }
	  res.json(results);
	});
});

server.listen(process.env.PORT || 8080, function(){
	console.log('Listening on Port: 8080');
});