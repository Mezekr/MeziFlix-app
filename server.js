const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer((req, res) => {
	let q = url.parse(req.url, true);
	let filePath = '';

	if (q.pathname.includes('documentation')) {
		filePath = __dirname + '/documentation.html';
	} else {
		filePath = 'index.html';
	}
	fs.readFile(filePath, (err, data) => {
		if (err) {
			res.writeHead(404, { 'Content-type': 'text/html' });
			res.end('404 not found');
		}
		res.writeHead('200', { 'Content-type': 'text/html' });
		res.write(data);
		res.end();
	});
}).listen(8080);

console.log('Movie app with Node test server is running on Port 8080.');
