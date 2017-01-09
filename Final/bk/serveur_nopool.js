/**
 * Created by sl on 11/31/16.
 */

var MysqlServ = '192.168.72.131';
var mysql = require('mysql');   // npm install mysql

var http = require('http');
var fs = require("fs");

const PORT = 8080;

var connection = mysql.createConnection({
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
	if (err) {
		response.statusCode = 404;
		response.end(err.toString());
		return;
	}
	response.setHeader("Content-type", "application/json");
	response.end(JSON.stringify(rows));
}

var ValidTables=['DirEntry', 'FileEntry', 'Volume'];

function GenericSelectHandler(TableNo, Id, response, callback) {
	var KeyNames=['DirId', 'Id', 'VolId'];
	connection.query(
		{
			sql: 'SELECT * FROM '+ValidTables[TableNo]+
				' WHERE '+KeyNames[TableNo]+'='+Id
		},
		function (err, rows, fields) {
			callback(err, rows, response);
		});
}

function handleRequest(request, response) {
	var i=0;
	//var SelectHandler=[OnDirEntry, OnFileEntry, OnVolume];
	var SelectHandler=[GenericSelectHandler, GenericSelectHandler, GenericSelectHandler];
	var Tokens=request.url.split('/');
	var Id=parseInt(Tokens[2]);
	console.log(Tokens);
	console.log(Id);
	for(i=0; i<3; i++)
		if(Tokens[1]==ValidTables[i])
			break;
	if(i==3 || Id<1 || isNaN(Id)) {
		response.statusCode = 404;
		response.end('url/(DirEntry|FileEntry|Volume)/...');
		return;
	}
	connection.connect(OnDbErr,
		GenericSelectHandler(i, Id, response, GenericDataHandler)
	);
}

/*
 * Main()
 */
if (process.argv.length != 2 && process.argv.length != 3) {
	console.log('Usage: ' + process.argv[1] + ' [IPDbServer]');
	return;
}
if (process.argv.length == 3)
	MysqlServ = process.argv[2];

var server = http.createServer(handleRequest);

server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:%s", PORT);
});

