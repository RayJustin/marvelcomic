var express     = require('express');
var port        = process.env.PORT || 8080;
var mongoose    = require('mongoose');
var passport    = require('passport');
var flash       = require('connect-flash');

// var morgan      = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser  = require('body-parser');
var session     = require('express-session');

var configDB    = require('./config/database.js');

var app         = express();
app.use(express.static('public'));

// config
mongoose.connect(configDB.url); // connect to DB

// require passport later
require('./config/passport')(passport);

// setup express app
// app.use(morgan('dev')); // log every request to console
app.use(cookieParser()); // read cookies for auth
app.use(bodyParser()); // get info from html forms

app.set('view engine', 'ejs'); // use ejs for templating

// required for passport
app.use(session({ secret: 'tjtestingnode' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages

// routes
require('./app/routes.js')(app, passport); // loud routes and pass in app & passport

// launch
app.listen(port);
console.log('the magic happens at http://localhost:'+port);