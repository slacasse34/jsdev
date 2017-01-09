/**
 * Created by slacasse on 11/16/2016.
 */
var http = require('http');

const PORT = 8080;

function HttpHandler(request, response) {
	var Tokens = request.url.split('?');
	if(Tokens.length==2) {
		response.end(Tokens[1]);
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
