var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var api = require('marvel-api');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/marvel');

mongoose.connection.on('error', function(err){
	console.error('Could not connect to DB:', err);
});

// Mongoose Models
var Character = require('./public/models/character');
var Series = require('./public/models/series');
var Comic = require('./public/models/comic');

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

app.get('/character/:id', function(req, res){
	// instead of calling API, call the database based on req.params.id
	Character.find({charID: req.params.id}, function(err, data){
		if(err){
			return err;
		}

		res.json(data);
	});
});

app.get('/series/:id', function(req, res){
	// Look for series in database by SeriesID, not by MongooseID. 
	// If not found, execute API call.
	Series.find({seriesID: req.params.id}, function(err, data){
		if(err){
			return err;
		}
		var id = data.seriesID;

		if(id === undefined){
			marvel.series.find(req.params.id, function(err, results){
				if(err){
					return res.sendStatus(err);
				}
				var comicList = [];
				for (var j = 0; j < results.data[0].comics.items.length; j++) {
			  		var comicid = results.data[0].comics.items[j].resourceURI.split('comics/');
			  		comicList.push(comicid[1]);
		  		}

				Series.create({
					name: results.data[0].title,
					seriesID: results.data[0].id,
					thumbnail: results.data[0].thumbnail.path + '.' + results.data[0].thumbnail.extension,
					numOfComics: results.data[0].comics.available,
					comics: comicList,
				},function(err, series){
					if(err){
						return res.status(500).json({
							message: 'Error'+ err
						});
					}
				});

				res.json(results);
			});
		}
		else{
			res.json(data);
		}
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