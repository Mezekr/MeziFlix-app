const express = require('express');
const app = express();

console.log('this is test');

app.get('/', (req, res) => res.send('This is express test.'));

app.listen(8080, () => console.log('Your app is listening on port 8080.'));
