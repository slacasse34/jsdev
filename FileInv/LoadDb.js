/**
 * Created by e1695936 on 2016-11-11.
 */
"option strict"

var MysqlServ = '192.168.72.131';
var mysql = require('mysql');   // npm install mysql

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

function LoadDb(ScriptFile, HandleEntry) {
	var rv = 0;
	var InFP = new File(ScriptFile);

	InFP.open("rt");
	while(!InFP.eof) {
		HandleEntry(InFP.readln());
	}
	InFP.close();
	return rv;
}

/* Handle query */
function EntryToDb(Entry) {
	var rv=0;
	connection.query(
		{
			sql: Entry,
		},
		function (err, rows, fields) {
			if (err) throw err;
			//rv = row.insertId;
			//console.log("added " + rv);
		}
	);
}

/* Debug */
function EntryToConsole(Filename, DirEntry) {
	console.log(Filename);
	console.log(DirEntry.size);
}

/*
 * Main()
 */
if (process.argv.length != 3) {
	console.log('Usage: ' + process.argv[1] + ' script.sql');
	return;
}
if (DbConnect(undefined))
	return;
//LoadDb(process.argv[2], EntryToDb);
LoadDb(process.argv[2], EntryToConsole);
DbDisconnect();
