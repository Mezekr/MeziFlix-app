const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();

const movies = [
	{
		Title: 'Avatar',
		Year: '2009',
		Rated: 'PG-13',
		Released: '18 Dec 2009',
		Runtime: '162 min',
		Genre: 'Action, Adventure, Fantasy',
		Director: 'James Cameron',
		Writer: 'James Cameron',
		Actors: 'Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang',
		Plot: 'A paraplegic marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
		Language: 'English, Spanish',
		Country: 'USA, UK',
		Awards: 'Won 3 Oscars. Another 80 wins & 121 nominations.',
		Poster: 'http://ia.media-imdb.com/images/M/MV5BMTYwOTEwNjAzMl5BMl5BanBnXkFtZTcwODc5MTUwMw@@._V1_SX300.jpg',
		Metascore: '83',
		imdbRating: '7.9',
		imdbVotes: '890,617',
		imdbID: 'tt0499549',
		Type: 'movie',
		Response: 'True',
		Images: [
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMjEyOTYyMzUxNl5BMl5BanBnXkFtZTcwNTg0MTUzNA@@._V1_SX1500_CR0,0,1500,999_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BNzM2MDk3MTcyMV5BMl5BanBnXkFtZTcwNjg0MTUzNA@@._V1_SX1777_CR0,0,1777,999_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTY2ODQ3NjMyMl5BMl5BanBnXkFtZTcwODg0MTUzNA@@._V1_SX1777_CR0,0,1777,999_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTMxOTEwNDcxN15BMl5BanBnXkFtZTcwOTg0MTUzNA@@._V1_SX1777_CR0,0,1777,999_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTYxMDg1Nzk1MV5BMl5BanBnXkFtZTcwMDk0MTUzNA@@._V1_SX1500_CR0,0,1500,999_AL_.jpg',
		],
	},
	{
		Title: 'The Wolf of Wall Street',
		Year: '2013',
		Rated: 'R',
		Released: '25 Dec 2013',
		Runtime: '180 min',
		Genre: 'Biography, Comedy, Crime',
		Director: 'Martin Scorsese',
		Writer: 'Terence Winter (screenplay), Jordan Belfort (book)',
		Actors: 'Leonardo DiCaprio, Jonah Hill, Margot Robbie, Matthew McConaughey',
		Plot: 'Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.',
		Language: 'English, French',
		Country: 'USA',
		Awards: 'Nominated for 5 Oscars. Another 35 wins & 154 nominations.',
		Poster: 'http://ia.media-imdb.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_SX300.jpg',
		Metascore: '75',
		imdbRating: '8.2',
		imdbVotes: '786,985',
		imdbID: 'tt0993846',
		Type: 'movie',
		Response: 'True',
		Images: [
			'https://images-na.ssl-images-amazon.com/images/M/MV5BNDIwMDIxNzk3Ml5BMl5BanBnXkFtZTgwMTg0MzQ4MDE@._V1_SX1500_CR0,0,1500,999_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTc0NzAxODAyMl5BMl5BanBnXkFtZTgwMDg0MzQ4MDE@._V1_SX1500_CR0,0,1500,999_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTExMDk1MDE4NzVeQTJeQWpwZ15BbWU4MDM4NDM0ODAx._V1_SX1500_CR0,0,1500,999_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTg3MTY4NDk4Nl5BMl5BanBnXkFtZTgwNjc0MzQ4MDE@._V1_SX1500_CR0,0,1500,999_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTgzMTg4MDI0Ml5BMl5BanBnXkFtZTgwOTY0MzQ4MDE@._V1_SY1000_CR0,0,1553,1000_AL_.jpg',
		],
	},
	{
		Title: 'I Am Legend',
		Year: '2007',
		Rated: 'PG-13',
		Released: '14 Dec 2007',
		Runtime: '101 min',
		Genre: 'Drama, Horror, Sci-Fi',
		Director: 'Francis Lawrence',
		Writer: 'Mark Protosevich (screenplay), Akiva Goldsman (screenplay), Richard Matheson (novel), John William Corrington, Joyce Hooper Corrington',
		Actors: 'Will Smith, Alice Braga, Charlie Tahan, Salli Richardson-Whitfield',
		Plot: 'Years after a plague kills most of humanity and transforms the rest into monsters, the sole survivor in New York City struggles valiantly to find a cure.',
		Language: 'English',
		Country: 'USA',
		Awards: '9 wins & 21 nominations.',
		Poster: 'http://ia.media-imdb.com/images/M/MV5BMTU4NzMyNDk1OV5BMl5BanBnXkFtZTcwOTEwMzU1MQ@@._V1_SX300.jpg',
		Metascore: '65',
		imdbRating: '7.2',
		imdbVotes: '533,874',
		imdbID: 'tt0480249',
		Type: 'movie',
		Response: 'True',
		Images: [
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTI0NTI4NjE3NV5BMl5BanBnXkFtZTYwMDA0Nzc4._V1_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTIwMDg2MDU4M15BMl5BanBnXkFtZTYwMTA0Nzc4._V1_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTc5MDM1OTU5OV5BMl5BanBnXkFtZTYwMjA0Nzc4._V1_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTA0MTI2NjMzMzFeQTJeQWpwZ15BbWU2MDMwNDc3OA@@._V1_.jpg',
		],
	},
	{
		Title: 'The Avengers',
		Year: '2012',
		Rated: 'PG-13',
		Released: '04 May 2012',
		Runtime: '143 min',
		Genre: 'Action, Sci-Fi, Thriller',
		Director: 'Joss Whedon',
		Writer: 'Joss Whedon (screenplay), Zak Penn (story), Joss Whedon (story)',
		Actors: 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth',
		Plot: "Earth's mightiest heroes must come together and learn to fight as a team if they are to stop the mischievous Loki and his alien army from enslaving humanity.",
		Language: 'English, Russian',
		Country: 'USA',
		Awards: 'Nominated for 1 Oscar. Another 34 wins & 75 nominations.',
		Poster: 'http://ia.media-imdb.com/images/M/MV5BMTk2NTI1MTU4N15BMl5BanBnXkFtZTcwODg0OTY0Nw@@._V1_SX300.jpg',
		Metascore: '69',
		imdbRating: '8.1',
		imdbVotes: '1,003,301',
		imdbID: 'tt0848228',
		Type: 'movie',
		Response: 'True',
		Images: [
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTA0NjY0NzE4OTReQTJeQWpwZ15BbWU3MDczODg2Nzc@._V1_SX1777_CR0,0,1777,999_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMjE1MzEzMjcyM15BMl5BanBnXkFtZTcwNDM4ODY3Nw@@._V1_SX1777_CR0,0,1777,999_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMjMwMzM2MTg1M15BMl5BanBnXkFtZTcwNjM4ODY3Nw@@._V1_SX1777_CR0,0,1777,999_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTQ4NzM2Mjc5MV5BMl5BanBnXkFtZTcwMTkwOTY3Nw@@._V1_SX1777_CR0,0,1777,999_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTc3MzQ3NjA5N15BMl5BanBnXkFtZTcwMzY5OTY3Nw@@._V1_SX1777_CR0,0,1777,999_AL_.jpg',
		],
	},
	{
		Title: 'Power',
		Year: '2014',
		Rated: 'TV-MA',
		Released: 'N/A',
		Runtime: '50 min',
		Genre: 'Crime, Drama',
		Director: 'N/A',
		Writer: 'Courtney Kemp Agboh',
		Actors: 'Omari Hardwick, Joseph Sikora, Andy Bean, Lela Loren',
		Plot: 'James "Ghost" St. Patrick, a wealthy New York night club owner who has it all, catering for the city\'s elite and dreaming big, lives a double life as a drug kingpin.',
		Language: 'English',
		Country: 'USA',
		Awards: '1 win & 6 nominations.',
		Poster: 'http://ia.media-imdb.com/images/M/MV5BOTA4NTkzMjUzOF5BMl5BanBnXkFtZTgwNzg5ODkxOTE@._V1_SX300.jpg',
		Metascore: 'N/A',
		imdbRating: '8.0',
		imdbVotes: '14,770',
		imdbID: 'tt3281796',
		Type: 'series',
		totalSeasons: '3',
		Response: 'True',
		Images: [
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTc2ODg0MzMzM15BMl5BanBnXkFtZTgwODYxODA5NTE@._V1_SY1000_SX1500_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTcyMjA0MzczNV5BMl5BanBnXkFtZTgwNTIyODA5NTE@._V1_SY1000_SX1500_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTk0MTI0NzQ2NV5BMl5BanBnXkFtZTgwMDkxODA5NTE@._V1_SY1000_SX1500_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTQ4Mzk1ODcxM15BMl5BanBnXkFtZTgwNDQyODA5NTE@._V1_SY1000_SX1500_AL_.jpg',
			'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwNTE0NDI1M15BMl5BanBnXkFtZTgwMDQyODA5NTE@._V1_SY1000_SX1500_AL_.jpg',
		],
	},
];

const users = [
	{
		id: 1,
		username: 'Mezi',
		favouriteMovies: [],
	},
	{
		id: 2,
		username: 'Daniel',
		favouriteMovies: [],
	},
	{
		id: 3,
		username: 'Marry',
		favouriteMovies: [],
	},
];

const logWriter = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
	flags: 'a',
});

// log to logger text file
app.use(morgan('combined', { stream: logWriter }));

// log to terminal
app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Welcome to MeziFlix movies app'));

// Return all the movies
app.get('/movies', (req, res) => res.json(movies));

// Return a movie by title
app.get('/movies/:title', (req, res) => {
	const movie = movies.find((movie) => movie.Title === req.params.title);
	if (movie) res.status(200).json(movie);
	else res.status(404).send(`Sorry! Movie with title ${title} not found`);
});

// Return a genre of a movie by title
app.get('/movies/genres/:title', (req, res) => {
	const movie = movies.find((movie) => movie.Title === req.params.title);
	if (movie) res.status(200).send(movie.Genre);
	else res.status(404).send(`Sorry! Movie with title ${title} not found`);
});

// Return a Director of a movie
app.get('/movies/directors/:directorName', (req, res) => {
	const director = movies.find(
		(movie) => movie.Director === req.params.directorName
	).Director;
	if (director)
		res.status(200).json({
			name: director,
			year: 'placeholder',
			bio: 'placeholder',
		});
	else
		res.status(404).send(`Sorry! Director with name ${director} not found`);
});

// error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something has gone wrong!');
});

app.listen(8080, () => console.log('Your app is listening on port 8080.'));
