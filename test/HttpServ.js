/**
 * Created by slacasse on 11/16/2016.
 */
var http = require('http');

const PORT = 8080;

function HttpHandler(request, response) {
	response.end('It works!  Path:' + request.url);
}

var server = http.createServer(HttpHandler);

server.listen(PORT, function () {
		console.log('Server listening on http://localhost:%s', PORT);
	}
);