/**
 * Created by slacasse on 11/16/2016.
 */
var http = require('http');

const PORT = 8080;

function HttpHandler(request, response) {
	var Now = new Date();
	if (request.url == '/date') {
		response.end('Current date:' + Now.toDateString());
		return;
	}
	if (request.url == '/time') {
		response.end('Current time:' + Now.toTimeString());
		return;
	}
	response.statusCode = 404;
	response.statusMessage = 'Valid url: /date or /time';
	// Un peu ordinaire comme message. ca prendrait un beau 404 not found
	response.end(response.statusMessage);
}

var server = http.createServer(HttpHandler);

server.listen(PORT, function () {
		console.log('Server listening on http://localhost:%s', PORT);
	}
);
