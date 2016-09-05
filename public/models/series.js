var mongoose = require('mongoose');

var SeriesSchema = new mongoose.Schema({
	name: String,
	seriesID: Number,
	thumbnail: String,
	numOfComics: Number,
	comics: [Number],
	updated: {type: Date, default: Date.now},
	show: {type: String, default: 'Yes'}
});

var Series = mongoose.model('Series', SeriesSchema);

module.exports = Series;