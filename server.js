var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var api = require('marvel-api');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var jsonParser = bodyParser.json();

require('./config/passport')(passport);

mongoose.connect('mongodb://localhost/marvel');

mongoose.connection.on('error', function(err){
	console.error('Could not connect to DB:', err);
});

// Mongoose Models
var Character = require('./app/models/character');
var Series = require('./app/models/series');
var Comic = require('./app/models/comic');
var User = require('./app/models/user');

var app = express();
var server = http.Server(app);

var marvel = api.createClient({
  publicKey: '629306f6ee3a76a9edb4bf7f908c11fe', 
  privateKey: '298af9ed6d48e71b8224e7e53f68b335f2587274'
});

require('./app/routes.js')(app, passport);

app.use(express.static('public'));

app.get('/characters', function(req, res){

	Character.find({show: 'Yes'}, function(err, data){
		if(err){
			return err;
		}

		res.json(data);
	});
});

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



app.post('/users', jsonParser, function(req,res){
	if(!req.body){
		return res.status(400).json({
			message: 'No request body'
		});
	}

	if (!('username' in req.body)){
		return res.status(422).json({
			message: 'Missing field: username'
		});
	}

	var username = req.body.username;

	if(typeof username !== 'string'){
		return res.status(422).json({
			message: 'Incorrect field type: username'
		});
	}

	username = username.trim();

	 if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }

    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }

    bcrypt.genSalt(10, function(err, salt){
    	if(err){
    		return res.status(500).json({
    			message: 'Internal Server error'
    		});
    	}

    	bcrypt.hash(password, salt, function(err, hash){
    		if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            var user = new User({
            	username: username,
            	password: hash
            });

            user.save(function(err){
            	if(err){
            		return res.status(500).json({
            			message: 'Internal server error'
            		});
            	}

            	return res.status(201).json({});
            });
    	});
    });   
});

var strategy = new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
},function(username, password, callback) {
	console.log(username);
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            callback(err);
            return;
        }

        if (!user) {
            return callback(null, false, {
                message: 'Incorrect username.'
            });
        }

        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            }

            if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return callback(null, user);
        });
    });
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local-signup',strategy);
app.use(passport.initialize());

app.post('/login', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login' // redirect back to the signup page if there is an error
}));

app.get('/login',function(req,res){
	res.json({
		message: 'login form here'
	});
});







server.listen(process.env.PORT || 8080, function(){
	console.log('Listening on Port: 8080');
});