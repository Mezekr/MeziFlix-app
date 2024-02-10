const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
	Title: {
		type: String,
		required: [true, 'Please include the Title of the movie'],
	},
	Description: {
		type: String,
		required: [true, 'Please include the Description of the movie'],
	},
	Genre: {
		Name: String,
		Description: String,
	},
	Director: {
		Name: String,
		Bio: String,
	},
	Actors: [String],
	ImagePath: String,
	Featured: Boolean,
});
