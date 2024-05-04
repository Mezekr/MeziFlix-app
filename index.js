require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const Models = require('./models/models.js');

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Origins allowed to access the API according to CORS data access policy
const allowedOrigins = [
	'http://localhost:8080',
	'http://testsite.com',
	'https://meziflix.netlify.app',
	'http://localhost:5173',
	'http://localhost:4200',
	'https://mezekr.github.io',
];

// Middleware to handle CORS allowed Origins requests
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				let message = `The CORS policy for this application \
				 				doesn’t allow access from origin ${origin}`;
				return callback(new Error(message), false);
			}
			return callback(null, true);
		},
	})
);

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

/**
 * GET index page
 * @function
 * @name getIndexPage
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} -  A string response.
 */
app.get('/', (req, res) => res.send('Welcome to MeziFlix Movies app.'));

/**
 * GET all movies as a list
 * @function
 * @name getAllMovies
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} - If there is an error while retrieving movies from the database.
 * @returns {Object} - Returns JSON response containing all movies.
 */
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

/**
 * GET movie by name
 * @function
 * @name getOneMovie
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.title - The title of the movie to retrieve.
 * @throws {Error} - If there is an error while retrieving the movie from the database.
 * @returns {Object} - Returns JSON response containing the requested movie.
 */
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

/**
 * GET the genre of a movie by the title of the movie
 * @function
 * @name getGenre
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.title - Movie title to retrieve its genre from the database.
 * @throws {Error} - If there is an error while retrieving genre from the database.
 * @returns {Object} - Returns JSON response containing the genre object of the requested movies.
 */
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

/**
 * GET the director of a movie by the title of the movie
 * @function
 * @name getDirector
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.directorName - The name of the director to retrieve from the database.
 * @throws {Error} - If there is an error while retrieving director from the database.
 * @returns {Object} - Returns JSON response containing the director object of the requested movies.
 */
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

/**
 * GETS all users
 * @function
 * @name getAllUsers
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} - 	On error to retrieve users from the database.
 * @returns {Object} - Returns JSON response containing the all users.
 */
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

/**
 * GET a user by username
 * @function
 * @name getOneUser
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.Username - The username of the user to retrieve.
 * @throws {Error} - 	On error retrieving the user from the database.
 * @returns {Object} - Returns JSON response containing the user with this username.
 */
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

/**
 * CREATE new user
 * @function
 * @name signupUser
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} - 	If an error occurs while creating the new user.
 * @returns {Object} - Returns JSON response containing the new user.
 */
app.post(
	'/users',
	[
		check('Username', 'Username is required').isLength({ min: 5 }),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear to be valid').isEmail(),
	],
	async (req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: errors.array() });
		}
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

/**
 * UPDATE User Information by User Name
 * @function
 * @name updateUser
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.Username - The username of the user to update.
 * @throws {Error} - If there is an error during input validation or
 * 						update of user data in the database.
 * @returns {Object} - JSON response containing the updated user.
 *  */
app.put(
	'/users/:Username',
	[
		check('Username', 'Username is required').isLength({ min: 5 }),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		// check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear to be valid').isEmail(),
		check('Birthday', 'Birthday must be a date format').isDate(),
	],
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		if (req.user.Username !== req.params.Username) {
			return res.status(400).json('Permission denied');
		}
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: errors.array() });
		}
		await Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$set: {
					Username: req.body.Username,
					// Password: req.body.Password,
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

/**
 * CREATE new favorite movie for user
 * @function
 * @name addFavMovie
 * @param {Object} req - Express request object.
 * @param {Object} req.user - User object obtained from JWT authentication.
 * @param {string} req.params.Username - The username of the user.
 * @param {string} req.params.MovieID - The ID of the movie to add to the user's favorites.
 * @param {Object} res - Express response object.
 * @throws {Error} - On error while updating user data in the database.
 * @returns {Object} - Returns JSON response containing the updated user's information.
 */
app.put(
	'/users/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	[
		check('Username', 'Username is required').isLength({ min: 5 }),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check(
			'MovieID',
			'MovieID is required and contains non alphanumeric characters - \
			 not allowed '
		)
			.not()
			.isEmpty()
			.isAlphanumeric(),
	],
	async (req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: errors.array() });
		}
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

/**
 * DELETE favorite movie for user
 * @function
 * @name deleteFavMovie
 * @param {Object} req - Express request object.
 * @param {Object} req.user - User object obtained from JWT authentication.
 * @param {string} req.params.Username - The username of the user.
 * @param {string} req.params.MovieID - The ID of the movie to remove from the user's favorites.
 * @param {Object} res - Express response object.
 * @throws {Error} - On error while updating user data in the database.
 * @returns {Object} - Returns JSON response containing the updated user's information.
 */
app.delete(
	'/users/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	[
		check('Username', 'Username is required').isLength({ min: 5 }),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check(
			'MovieID',
			'MovieID is required and contains non alphanumeric characters \
			- not allowed'
		)
			.not()
			.isEmpty()
			.isAlphanumeric(),
	],
	async (req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: errors.array() });
		}
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

/**
 * DELETE a user by Username
 * @function
 * @name deleteUser
 * @param {Object} req - Express request object.
 * @param {Object} req.user - User object obtained from JWT authentication.
 * @param {string} req.params.Username - The username of the user to delete.
 * @param {Object} res - Express response object.
 * @throws {Error} -  On error while deleting the user from the database.
 * @returns {Object} - Returns message indicating whether the user was successfully deleted or not.
 */
app.delete(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	[
		check('Username', 'Username is required').isLength({ min: 5 }),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
	],
	async (req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: errors.array() });
		}
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

// error handling on server
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Error on the server. Please try again');
});

// Database connection
mongoose.set('strictQuery', false);
mongoose
	.connect(MONGODB_URL)
	.then(() => {
		console.log('Connection to Database is succesful.');
		app.listen(PORT, () =>
			console.log(`Your app is listening on port ${PORT}.`)
		);
	})
	.catch((error) => {
		console.log(error);
	});
