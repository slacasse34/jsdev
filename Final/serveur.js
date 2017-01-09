/**
 * Created by sl on 11/31/16.
 */

var MysqlServ = '192.168.2.105';
var mysql = require('mysql');   // npm install mysql
var http = require('http');
var fs = require("fs");

const PORT = 8080;

var db = mysql.createPool({
	connectionLimit: 4,
	host: MysqlServ,
	user: 'sl',
	password: '',
	database: 'FileInv'
});

function OnDbErr(err) {
	console.log('Got Db error:' + err);
}

function DbDisconnect() {
	connection.end(OnDbErr);
}

function GenericDataHandler(err, rows, response) {
	if (err || rows.length < 1) {
		response.statusCode = 404;
		if (err !== null)
			response.end(err.toString());
		else
			response.end("err==null. Record can't be found!");
		return;
	}
	response.setHeader("Content-type", "application/json");
	console.log(rows);
	response.end(JSON.stringify(rows));
}

var ValidTables = ['DirEntry', 'FileEntry', 'Volume', 'FileInfo'];

function GenericSelectHandler(TableNo, Id, response, callback) {
	var KeyNames = ['DirId', 'Id', 'VolId', 'Cksum'];
	var Select = 'SELECT * FROM ' + ValidTables[TableNo]
		+ ' WHERE ' + KeyNames[TableNo] + '=' + Id;
	console.log(Select);
	db.query(
		{
			sql: Select
		},
		function (err, rows, fields) {
			callback(err, rows, response);
		});
}

function ReloadHTML(response) {
	response.setHeader('Content-Type', "text/html");
	fs.readFile(__dirname + '/' + "modify.html", function (err, data) {
		if (err) {
			response.statusCode = 404;
			response.end(err.toString());
			return true;
		}


		response.statusCode = 200;
		response.end(data);
		return true;
	});

}

function handleNewVolume(request, response) {

	var body = [];
	request.on('data', function (chunk) {
		body.push(chunk);
	}).on("error", function () {
		response.statusCode = 404;
		response.end("Some insert error!?");
	}).on('end', function () {
		var stringBody = Buffer.concat(body).toString();
		console.log(body);
		console.log(stringBody);
		var input = JSON.parse(stringBody);

		db.query("insert into Volume set ?", input, function (err, rows) {

			if (checkAndReturn(response, err))
				return;

			input.id = rows.insertId;
			response.writeHead(201, {
				'Content-Type': 'application/json',
				'Location': request.url + "/" + rows.insertId
			});

			response.end(JSON.stringify(input));
		});
	});
}

function handleRequest(request, response) {
	var i = 0;
	var DbHandler = [GenericSelectHandler, GenericSelectHandler, GenericSelectHandler, GenericSelectHandler];
	var Tokens = request.url.split('/');
	var Id = parseInt(Tokens[2]);
	if ( request.method == "POST" ) {
		console.log("Posting:"+request.url);
		handleNewVolume(request, response);
		return;
	}
	if (request.url === '/') {
		ReloadHTML(response);
		return;
	}
	console.log(request.url);
	//console.log(Tokens);
	//console.log(Tokens.length);
	console.log(Id);
	for (i = 0; i < ValidTables.length; i++)
		if (Tokens[1] === ValidTables[i])
			break;
	if (i === ValidTables.length || Id < 1 || isNaN(Id)) {
		response.statusCode = 404;
		response.end('url/(DirEntry|FileEntry|Volume)/...');
		return;
	}
	DbHandler[i](i, Id, response, GenericDataHandler);
}

/*
 * Main()
 */
if (process.argv.length !== 2 && process.argv.length !== 3) {
	console.log('Usage: ' + process.argv[1] + ' [IPDbServer]');
	return;
}
if (process.argv.length === 3)
	MysqlServ = process.argv[2];

var server = http.createServer(handleRequest);

server.listen(PORT, function () {
	console.log("Server listening on: http://localhost:%s", PORT);
});

