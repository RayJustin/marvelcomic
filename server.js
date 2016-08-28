var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();
var server = http.Server(app);

app.use(express.static('public'));

server.listen(process.env.PORT || 8080, function(){
	console.log('Listening on Port: 8080');
});