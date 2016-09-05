var mongoose = require('mongoose');

var CharSchema = new mongoose.Schema({
	name: String,
	charID: Number,
	thumbnail: String,
	numOfComics: Number,
	numOfSeries: Number,
	series: [String],
	updated: {type: Date, default: Date.now},
	show: {type: String, default: 'No'}
});

var Character = mongoose.model('Character', CharSchema);

module.exports = Character;