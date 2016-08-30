var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var api = require('marvel-api');

var app = express();
var server = http.Server(app);

var marvel = api.createClient({
  publicKey: '629306f6ee3a76a9edb4bf7f908c11fe', 
  privateKey: '298af9ed6d48e71b8224e7e53f68b335f2587274'
});

app.use(express.static('public'));

app.get('/characters', function(req,res){

	marvel.characters.findAll(function(err, results) {
	  if (err) {
	    return res.sendStatus(err);
	  }
	 // loop over results to see if they are in the database, if not add them
	  res.json(results);
	});

});

app.get('/character/:id', function(req,res){
	// instead of calling API, call the database based on req.params.id
	marvel.characters.find(req.params.id,function(err, results) {
	  if (err) {
	    return res.sendStatus(err);
	  }
	 
	  res.json(results);
	});
});

server.listen(process.env.PORT || 8080, function(){
	console.log('Listening on Port: 8080');
});