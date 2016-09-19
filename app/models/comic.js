var mongoose = require('mongoose');

var ComicSchema = new mongoose.Schema({
	name: String,
	comicID: Number,
	thumbnail: String,
	series: Number,
	characters: [Number],
	detail: String,
	updated: {type: Date, default: Date.now},
	show: {type: String, default: 'Yes'}
});

var Comic = mongoose.model('Comic', ComicSchema);

module.exports = Comic;