const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const models = require('./models/models');

const Users = models.User;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// Local HTTP-Authentication Passport middleware strategy
passport.use(
	new LocalStrategy(
		{
			usernameField: 'Username',
			passwordField: 'Password',
			session: false,
		},
		async (username, password, callback) => {
			console.log(`${username} ${password}`);
			await Users.findOne({ Username: username })
				.then((user) => {
					if (!user) {
						console.log('The username or password is incorrect.');
						return callback(null, false, {
							message: 'The username or password is incorrect.',
						});
					}
					console.log('Ready');
					return callback(null, user);
				})
				.catch((err) => {
					if (err) {
						console.error(err);
						callback(err, false);
					}
				});
		}
	)
);
