var api = require('marvel-api');
var Character = require('./models/character');
var Series = require('./models/series');
var Comic = require('./models/comic');

module.exports = function(app, passport){


	var marvel = api.createClient({
	  publicKey: '629306f6ee3a76a9edb4bf7f908c11fe', 
	  privateKey: '298af9ed6d48e71b8224e7e53f68b335f2587274'
	});

	// home page with login links
	app.get('/', function(req,res){
		var logout = false;
		if(req.user){
			logout = true;
		}

		Character.find({show: 'Yes'}, function(err, data){
			if(err){
				return err;
			}

			res.render('character.ejs', {logout: logout, user: req.user, characters: data}); 
		});
	});

	app.get('/character/:id', function(req,res){
		var character;
		var series = [];

		var cb = function(char,seriesItem){
			character = char;
			series.push(seriesItem);
			if(series.length == character.series.length){
				res.render('series.ejs', {user: req.user, character: character, series: series}); 
			}
		}

		Character.find({charID: req.params.id}, function(err, data){
			if(err){
				return err;
			}
			for (var i = 0; i < data[0].series.length; i++) {
				Series.find({seriesID: data[0].series[i]}, function(err2,data2){
					cb(data[0],data2[0]);
				});
			}
		});

	});

	app.get('/series/:id', function(req,res){
		var series;
		var comics = [];

		var cb = function(s,comicID){
			series = s;
			Comic.find({comicsID: comicID}, function(err2,data2){
				if(typeof data2[0] === "undefined"){
					marvel.comics.find(comicID, function(err3, results){
						if (err3) {
						    return console.error(JSON.stringify(err3));
						}
				  		var data3 = [];
				  		data3[0] = {
				  			name: results.data[0].title,
				  			comicID: results.data[0].id,
				  			thumbnail: results.data[0].thumbnail.path + '.' + results.data[0].thumbnail.extension,
				  			series: req.params.id,
				  		}

						Comic.create(data3[0],function(err, series){
							if(err){
								return res.status(500).json({
									message: 'Error'+ err
								});
							}
						});

						comics.push(data3[0]);
						if(comics.length == series.comics.length){
							res.render('comic.ejs', {user: req.user, comics: comics, series: series}); 
						}
					});
				}
				else{
					comics.push(data2[0]);
					if(comics.length == series.comics.length){
						res.render('comic.ejs', {user: req.user, comics: comics, series: series}); 
					}
				}
			});
		}

		Series.find({seriesID: req.params.id}, function(err, data){
			if(err){
				return err;
			}
			for (var i = 0; i < data[0].comics.length; i++) {
				cb(data[0],data[0].comics[i]);
			}
		});
	});

	app.get('/comic/:id', function(req,res){

		Comic.find({comicID: req.params.id}, function(err, data){
			if(err){
				return err;
			}
			res.render('detail.ejs', {user: req.user, comic: data[0]}); 
		});

	});

	// login
	app.get('/login', function(req,res){
		// render login page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process login form
	app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true, // allow flash messages
        session: true
    }));

	// signup
	app.get('/signup', function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage')});
	});

	// process signup form
	app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true, // allow flash messages
        session: true
    }));

	// profile
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', {
			user: req.user // get user out of session
		});
	});	

	// logout
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next){
	if(req.isAuthenticated())
		return next();

	res.redirect('/');
}