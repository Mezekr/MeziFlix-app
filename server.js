const http = require('http');

http.createServer((req, res) => {
	res.writeHead('200', { 'Content-type': 'text/html' });
	res.write('Hello Movie app!');
	res.end();
}).listen(8080);

console.log('Movie app with Node test server is running on Port 8080.');
