const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

const topMovies = [
	{
		id: 1,
		title: 'Avatar',
		year: 2009,
		director: 'James Cameron',
		writer: 'James Cameron',
	},
	{
		id: 2,
		title: 'The Avengers',
		year: 2012,
		director: 'Joss Whedon',
		writer: 'Joss Whedon',
	},
	{
		id: 3,
		title: 'The Wolf of Wall Street',
		year: 2013,
		director: 'Martin Scorsese',
		writer: 'Terence Winter (screenplay)',
	},
	{
		id: 4,
		title: 'I Am Legend',
		year: 2007,
		director: 'Francis Lawrence',
		writer: 'Mark Protosevich (screenplay), Akiva Goldsman (screenplay)',
	},
	{
		id: 5,
		title: 'The Irishman',
		year: 2019,
		director: 'Martin Scorsese',
		writer: 'Steven Zaillian (screenplay), Charles Brandt (book)',
	},
];

const logWriter = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
	flags: 'a',
});

// app.use(morgan('common'));
app.use(morgan('combined', { stream: logWriter }));

app.use(express.static('public'));

app.get('/', (req, res) => res.send('Welcome to MeziFlix movies app'));

app.get('/movies', (req, res) => res.json(topMovies));

app.listen(8080, () => console.log('Your app is listening on port 8080.'));
