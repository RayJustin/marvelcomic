var mongoose = require('mongoose');

var ReadSchema = new mongoose.Schema({
	comicID: String,
	user: String
});

var Read = mongoose.model('Read', ReadSchema);

module.exports = Read;