/**
 * Created by slacasse on 11/16/2016.
 */
"option strict"
var MysqlServ = '192.168.72.131';
var http = require('http');
var mysql = require('mysql');   // npm install mysql

const PORT = 8080;
var Total=0;
var gresponse;

var connection = mysql.createConnection({
	host: MysqlServ,
	user: 'sl',
	password: '',
	database: 'FileInv'
});

function OnDbErr(err) {
	console.log('Got Db error:' + err);
}

function DbConnect(Host) {
	if (Host != undefined)
		connection.host = Host;
	connection.connect(OnDbErr);
	return connection.err;
}

function DbDisconnect() {
	connection.end(OnDbErr);
}

function  EvalTotalCallback(err, rows, fields) {
	var i=0;

	if (err) throw err;
	for(Total=0, i=0; i<rows.lenght; i++)
		Total=Total+rows[i].montant*rows[i].quantite;
	gresponse.end('Total: ' + Total);
}

function EvalTotal(FID) {
	connection.query(
		{
			sql: 'SELECT montant,quantite FROM Ligne_Facture WHERE facture_id = ?',
			values: FID
		},
		EvalTotalCallback
	);
}

function HttpHandler(request, response) {
	if (request.url.lenght<2) {
		response.statusCode = 404;
		response.statusMessage = 'Valid url: /number';
		response.end(response.statusMessage);
		return;
	}
	FactId=request.url.substring(1);
	EvalTotal(FactId);
	//Wait for response from database
	//response.end('Total: ' + Total);
	gresponse=response;
}

var server = http.createServer(HttpHandler);

DbConnect();
server.listen(PORT, function () {
		console.log('Server listening on http://localhost:%s', PORT);
	}
);
