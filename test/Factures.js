/**
 * Created by slacasse on 11/16/2016.
 */
"option strict"
var MysqlServ = '192.168.72.131';
var mysql = require('mysql');   // npm install mysql

var connection = mysql.createConnection({
	host: MysqlServ,
	user: 'sl',
	password: '',
	database: 'test'
});

function OnDbErr(err) {
	console.log('Got Db error:' + err);
	Got Db error:null
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

function AddRecord(Ndx) {
	var rv=0;
	var Facture = [
	{
		nom: 'Joseph',
		date_creation: '2016-11-21',
		paye: 0	
	},
	{
		nom: 'John Doe',
		date_creation: '2016-11-22',
		paye: 1	
	},
	{
		nom: 'Jane Doe',
		date_creation: '2016-11-20',
		paye: 0	
	},
	];
	connection.query(
	{
		sql: "INSERT INTO Facture SET ?",
		values: Facture[Ndx]
	},
	function (err, rows, fields) {
		if (err) throw err;
		rv = rows.insertId;
		for(i=0; i<3; i++) {
			var Ligne = {
				montant: Math.floor((Math.random() * 1000)),
				quantite: Math.floor((Math.random() * 100)),
				facture_id: rv
			};
			connection.query(
				{
					sql: "INSERT INTO Ligne_Facture SET ?",
					values: Ligne
				},
				function(err, rows, fields) {
					if (err) throw err;
				}
			);
		}
		// Attendre que tout les insert finis.
		//DbDisconnect();
	}
	);
}

function FillTables() {
	var i=0;

	for(i=0; i<3; i++)
		AddRecord(i);
}


DbConnect();
FillTables();
// Attendre que tout les insert finis.
//DbDisconnect();
