const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Models = require('./models/models.js');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authorization module
const auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport');

// Mongoose models
const Movies = Models.Movie;
const Users = Models.User;

const logWriter = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
	flags: 'a',
});

// log to logger text file
app.use(morgan('combined', { stream: logWriter }));

// log to terminal
app.use(morgan('common'));

app.use(express.static('public'));

// app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Welcome to MeziFlix Movies app.'));

// Return all the movies
app.get(
	'/movies',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		await Movies.find({})
			.then((movies) => {
				res.status(200).json(movies);
			})
			.catch((error) => {
				console.error('Error' + error);
				res.status(500).send('Error' + error);
			});
	}
);

// Return a movie by title
app.get(
	'/movies/:title',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		await Movies.findOne({ Title: req.params.title })
			.then((movie) => {
				res.status(200).json(movie);
			})
			.catch((error) => {
				console.error('Error' + error);
				res.status(500).send('Error' + error);
			});
	}
);

// Return a genre of a movie by title
app.get(
	'/movies/genres/:title',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		await Movies.findOne({ Title: req.params.title })
			.then((movie) => {
				res.status(200).json(movie.Genre);
			})
			.catch((error) => {
				console.error('Error' + error);
				res.status(500).send('Error' + error);
			});
	}
);

// Return a Director of a movie
app.get(
	'/movies/directors/:directorName',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		await Movies.findOne({ 'Director.Name': req.params.directorName })
			.then((movie) => {
				res.status(200).json(movie.Director);
			})
			.catch((error) => {
				console.error('Error' + error);
				res.status(500).send('Error' + error);
			});
	}
);

// Return all  users
app.get(
	'/users',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		await Users.find({})
			.then((users) => {
				res.status(200).json(users);
			})
			.catch((error) => {
				console.error('Error' + error);
				res.status(500).send('Error' + error);
			});
	}
);
// Return user by Username
app.get(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		await Users.findOne({ Username: req.params.Username })
			.then((user) => {
				res.status(200).json(user);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send('Error' + error);
			});
	}
);

// Register a new user
app.post(
	'/users',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		await Users.findOne({ Username: req.body.Username })
			.then((user) => {
				if (user) {
					return res
						.status(409)
						.send(`Username ${req.body.Username} already exist`);
				} else {
					Users.create(req.body)
						.then((user) => {
							res.status(201).json(user);
						})
						.catch((error) => {
							console.error(error);
							res.status(500).send('Error' + error);
						});
				}
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send('Error' + error);
			});
	}
);

app.put(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		if (req.user.Username !== req.params.Username) {
			return res.status(400).json('Permission denied');
		}
		await Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$set: {
					Username: req.body.Username,
					Password: req.body.Password,
					Email: req.body.Email,
					Birthday: req.body.Birthday,
				},
			},
			{ new: true }
		)
			.then((updatedUser) => {
				res.status(201).json(updatedUser);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send('Error' + error);
			});
	}
);

// User add movie to favorites
app.put('/users/favorites/:id', (req, res) => {
	const user = users.find((user) => user.id == req.params.id);
	if (user) {
		user.favouriteMovies.push(req.body.title);
		res.status(201).json(user);
	} else
		res.status(404).send(`Sorry! Movie with title ${favMovie} not found`);
});

// User add movie to favorites
app.put(
	'/users/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		await Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$push: { FavouriteMovies: req.params.MovieID },
			},
			{ new: true }
		)
			.then((updatedUser) => {
				res.status(201).json(updatedUser);
			})
			.catch((error) => {
				console.error(err);
				res.status(500).send('Error: ' + error);
			});
	}
);

// User delete movie from favorites by Movie ID
app.delete(
	'/users/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		await Users.findOne({ Username: req.params.Username })
			.then(async (user) => {
				const favMovie = user.FavouriteMovies.find((movie) => {
					return movie == req.params.MovieID;
				});
				if (!favMovie) {
					res.status(404).send(
						`A Movie with ID ${req.params.MovieID} not found`
					);
				} else {
					await Users.findOneAndUpdate(
						{ Username: req.params.Username },
						{
							$pull: { FavouriteMovies: req.params.MovieID },
						},
						{ new: true }
					)
						.then((updatedUser) => {
							res.status(200).json(updatedUser);
						})
						.catch((error) => {
							console.error(err);
							res.status(500).send('Error: ' + error);
						});
				}
			})
			.catch((error) => {
				console.error(err);
				res.status(500).send('Error: ' + error);
			});
	}
);

// User remove movie from favourites
app.delete('/users/favorites/:id/:favTitle', (req, res) => {
	const { id, favTitle } = req.params;
	const user = users.find((user) => user.id == id);
	if (user && favTitle) {
		user.favouriteMovies = user.favouriteMovies.filter(
			(favTitle) => favTitle !== title
		);
		res.status(200).send(
			`${favTitle} removed from your Favourite Movies list`
		);
	} else
		res.status(404).send(`Sorry! Movie with title ${favTitle} not found`);
});

app.delete(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		await Users.findOneAndDelete({ Username: req.params.Username })
			.then((user) => {
				if (!user) {
					return res
						.status(400)
						.send(`Username ${req.body.Username} not found`);
				} else res.status(200).json(user);
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send('Error' + error);
			});
	}
);

// error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something has gone wrong!');
});

// Database connection
mongoose
	.connect('mongodb://db:27017/meziFlix_db')
	.then(() => {
		console.log('connection to Database is succesful');
		app.listen(8080, () =>
			console.log('Your app is listening on port 8080.')
		);
	})
	.catch((error) => {
		console.log(error);
	});
