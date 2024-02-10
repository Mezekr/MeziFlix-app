const mongoose = require('mongoose');

const movieSchema = mongoose.Schema(
	{
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
	},
	{
		timestamps: true,
	}
);

// Users Mongoose Models Schema

const userSchema = mongoose.Schema(
	{
		Username: {
			type: String,
			required: [true, 'Please enter a username.'],
		},
		Password: {
			type: String,
			required: [
				true,
				'The password must not be empty. Please enter a password.',
			],
		},
		Email: {
			type: String,
			required: [true, 'Please fill in an email address.'],
		},
		Birthday: Date,
		FavouriteMovies: [
			{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
		],
	},
	{
		timestamps: true,
	}
);

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
