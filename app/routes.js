var api = require('marvel-api');
var Character = require('./models/character');
var Series = require('./models/series');
var Comic = require('./models/comic');
var Read = require('./models/read');

module.exports = function(app, passport){

	var marvel = api.createClient({
	  publicKey: '629306f6ee3a76a9edb4bf7f908c11fe', 
	  privateKey: '298af9ed6d48e71b8224e7e53f68b335f2587274'
	});

	// Loads Home Page
	app.get('/', function(req,res){
		Character.find({show: 'Yes'}, function(err, data){
			if(err){
				return err;
			}
			res.render('character.ejs', {user: req.user, characters: data}); 
		});
	});
	// Loads Character Page 
	app.get('/character/:id', function(req, res, next){
		var character;
		var series = [];
		var readArr = [];
		if(typeof req.user !== "undefined"){
			
			Read.find({user: req.user._id}, function(err2, data2){
				if(err2){
					return err2;
				}
				if(typeof data2[0] !== "undefined"){
					for (var i = 0; i < data2.length; i++) {
						readArr.push(parseInt(data2[i].comicID));
					}
				}
			});
		}
		// Callback allows all the database calls to finish before rendering the page
		var cb = function(char, seriesItem){
			character = char;

			Series.find({seriesID: seriesItem}, function(err, data){
				if(err){
					return err;
				}
				if(typeof data[0] === "undefined"){
					
					marvel.series.find(seriesItem, function(err2, results){
						if(err2){
							return res.sendStatus(err2);
						}
						var comicList = [];
						for (var j = 0; j < results.data[0].comics.items.length; j++) {
					  		var comicid = results.data[0].comics.items[j].resourceURI.split('comics/');
					  		comicList.push(comicid[1]);
				  		}

				  		var data2 = [];
				  		data2[0] = {
				  			name: results.data[0].title,
							seriesID: results.data[0].id,
							thumbnail: results.data[0].thumbnail.path + '.' + results.data[0].thumbnail.extension,
							numOfComics: results.data[0].comics.available,
							comics: comicList
				  		}

						Series.create(data2[0],function(err3, series){
							if(err3){
								return res.status(500).json({
									message: 'Error'+ err
								});
							}
							// TJ needs to help me with this, no idea what were gonna do here...
							marvel.series.comics(results.data[0].id, 20, 0, function(err, seriesResults){
								if(err){
									return err;
								}
								// console.log(seriesResults);
							});
						});

						series.push(data2[0]);
						if(series.length == character.series.length){
							res.render('series.ejs', {user: req.user, character: character, series: series, read: readArr}); 
						}
					});	
				}
					else {
						series.push(data[0]);
						if(series.length == character.series.length){
							res.render('series.ejs', {user: req.user, character: character, series: series, read: readArr}); 
							next();
					}
				}
			});
		}

		Character.find({charID: req.params.id}, function(err, data){
			if(err){
				return err;
			}
			
			for (var i = 0; i < data[0].series.length; i++) {
				cb(data[0], data[0].series[i]);
			}
		});
	});

	// Loads Series Page
	app.get('/series/:id', function(req, res){
		var series;
		var comics = [];
		var read = [];
		if(typeof req.user !== "undefined"){
			var userID = req.user._id;
		}
		
		var cb = function(s, comicID){
			series = s;
			if(typeof userID !== "undefined"){
				Read.find({user: userID, comicID: comicID}, function(err, data){
					if(err){
						return err;
					}
					if(typeof data[0] !== "undefined"){
						read.push(parseInt(data[0].comicID));
					}
				});
			}

			Comic.find({comicID: comicID}, function(err2, data2){

				if(typeof data2[0] === "undefined"){
					marvel.comics.find(comicID, function(err3, results){
						if (err3) {
						    return console.error(JSON.stringify(err3));
						}
						var chars = [];

						for(var i = 0; i < results.data[0].characters.items.length; i++){
							var charID = results.data[0].characters.items[i].resourceURI.split('characters/');
							chars.push(parseInt(charID[1]));
						}
						var detailUrl = "";
						for (var i = 0; i < results.data[0].urls.length; i++) {
							if(results.data[0].urls[i].type == "detail"){
								detailUrl = results.data[0].urls[i].url;
							}
						}
				  		var data3 = [];
				  		data3[0] = {
				  			name: results.data[0].title,
				  			comicID: results.data[0].id,
				  			thumbnail: results.data[0].thumbnail.path + '.' + results.data[0].thumbnail.extension,
				  			series: req.params.id,
				  			characters: chars,
				  			detail: detailUrl
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
							res.render('comic.ejs', {user: req.user, comics: comics, series: series, read: read}); 
						}
					});
				}
				else{
					comics.push(data2[0]);
					if(comics.length == series.comics.length){
						res.render('comic.ejs', {user: req.user, comics: comics, series: series, read: read}); 
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

	// Loads Comic Page
	app.get('/comic/:id', function(req, res){
		var readArr = [];
		var characters = [];
		if(typeof req.user !== "undefined"){
				Read.find({user: req.user._id, comicID: req.params.id}, function(err, data){
					if(typeof data[0] !== "undefined"){
						readArr.push(parseInt(data[0].comicID));
					}
					// else{
					// 	return;
					// }
				});
			}

		Comic.find({comicID: req.params.id}, function(err, data){
			if(err){
				return err;
			}
			for(var i = 0; i < data[0].characters.length; i++){
				characterFind(data[0].characters[i], i, data[0]);
			}
		});

		var characterFind = function(id, i, comic){
			Character.find({charID: id}, function(err, data2){
				if(err){
					return err;
				}
				characters.push(data2[0]);

				if(i == comic.characters.length - 1){
					res.render('detail.ejs', {user: req.user, comic: comic, characters: characters, read: readArr}); 
				}
			});
		}	
	});

	// Login
	app.get('/login', function(req, res){
		res.render('login.ejs', {user: req.user, message: req.flash('loginMessage') });
	});

	
	app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', 
        failureRedirect : '/login', 
        failureFlash : true, 
        session: true
    }));

	// Sign Up
	app.get('/signup', function(req, res){
		res.render('signup.ejs', {user: req.user, message: req.flash('signupMessage')});
	});

	
	app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup', 
        failureFlash : true, 
        session: true
    }));

	// profile
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', {user: req.user});
	});	

	// logout
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	// Loads Contact Page 
	app.get('/contact', function(req, res){
		res.render('contact.ejs', {user: req.user});
	});

	app.get('/read/:id', function(req, res){
		
		Read.find({comicID: req.params.id, user: req.user._id}, function(err, data){
			// Check to see if anything was found
			if(typeof data[0] === 'undefined'){
				// If not, create a document 
				Read.create({
					comicID: req.params.id,
					user: req.user._id
					}, function(err, read){
					if(err){
						return res.status(500).json({
							message: 'Error:' + err
						});
					}
					return res.status(200).end();
				});
			}
			else{
				// If yes, remove the returned document
				Read.findOneAndRemove({comicID: req.params.id, user: req.user._id}, function(err, read){
					if(err){
						return res.status(500).json({
							message: 'Error:' + err
						});
					}
					return res.status(200).end();
				});
			}
		});
	});
};

function isLoggedIn(req, res, next){
	if(req.isAuthenticated())
		return next();

	res.redirect('/');
}
