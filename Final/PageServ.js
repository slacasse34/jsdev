/**
 * Created by slacasse on 11/16/2016.
 */
var http = require('http');
var fs = require('fs');

const PORT = 8080;

function handleFile(PageName, request, response) {
    
    if (! request.url.match(/^.*\..*$/)) {
        return false;
    }

        console.log(PageName);

    var extension = request.url.split(".")[1];
    var types = {
        "html": "text/html",
        "jpg": "image/jpeg",
        "gif": "image/gif"
    };


    var mimeType = types[extension];
    if ( mimeType != undefined) {


        response.setHeader('Content-Type', mimeType);
    }


    fs.readFile( __dirname + '/' + PageName, function (err, data) {
        if (err) {
            response.statusCode = 404;
            response.end();
            return true;
        }


        response.statusCode = 200;
        response.end(data);
        return true;
    });
    return true;
}

function Generic404(response, Message) {
	response.statusCode = 404;
	response.statusMessage = Message;
	// Un peu ordinaire comme message. ca prendrait un beau 404 not found
	response.end(response.statusMessage);    
}

function GetIndex(Ndx) {
    if(Ndx[0]>8)
        return -1;
    return ++ Ndx[0];
}

function GetPrevIndex(Ndx) {
    if(Ndx[0]<2)
        return -1;
    return -- Ndx[0];
}

var CurPage=[0];

function HttpHandler(request, response) {
        var PageName='PrevNext.html';
	var Tokens = request.url.split('/');
	if(Tokens.length!==2) {
		Generic404(response, 'Bad URL:'+Tokens[0]);
		return;
	}
        console.log(CurPage);
        PageName=Tokens[1];
        if(Tokens[1]==='NextFile.html')
            PageName='Page'+GetIndex(CurPage)+'.html';
        if(Tokens[1]==='PrevFile.html')
            PageName='Page'+GetPrevIndex(CurPage)+'.html';
        console.log(CurPage);
        if(handleFile(PageName, request, response))
            return;
        Generic404(response, 'File skipped for url:'+request.url);
}

var server = http.createServer(HttpHandler);

server.listen(PORT, function () {
		console.log('Server listening on http://localhost:%s', PORT);
	}
);
