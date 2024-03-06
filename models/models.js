const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
			Birth: Date,
			Death: Date,
		},
		Actors: [String],
		ImagePath: String,
		Featured: Boolean,
		ReleaseYear: String,
		Rating: Number,
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

//Password Hashing
// userSchema.statics.hashPassword = (password) => {
// 	return bcrypt.hashSync(password, 10);
// };

userSchema.pre('save', async function (next) {
	if (!this.isModified('Password')) return next();
	//hash the password
	this.Password = await bcrypt.hash(this.Password, 8);
	next();
});

userSchema.methods.validatePassword = async function (password) {
	return await bcrypt.compare(password, this.Password);
};

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
