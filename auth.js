const passport = require('passport');
const jsonwebtoken = require('jsonwebtoken');
const localpassport = require('./passport');

// This has to be the same key used in the JWTStrategy
const JWSTOKEN = 'your_token_key';

// Generate a Jwt Token
let generateJWTToken = (user) => {
	jsonwebtoken.sign(user, JWSTOKEN, {
		subject: user.Username,
		expiresIn: '3d',
		algorithm: 'HS256',
	});
};

// login post endpoint
module.exports = (router) => {
	router.post('/login', (req, res) => {
		passport.authenticate(
			'local',
			{ session: false },
			(error, user, info) => {
				if (error || !user) {
					return res.status(400).json({
						message: 'Something went wrong.',
						user: user,
					});
				}
				req.login(
					(user,
					{ session: false },
					(error) => {
						if (error) res.send(error);
						let token = generateJWTToken(user.toJSON());
						return res.json(user, token);
					})
				);
			}
		);
	});
};
