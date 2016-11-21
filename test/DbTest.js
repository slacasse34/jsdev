/**
 * Created by slacasse on 11/16/2016.
 */
"option strict"

var MysqlServ = '192.168.72.131';
var DirList = [];
var FileList = [];
var mysql = require('mysql');   // npm install mysql
var pool = mysql.createPool({
	connectionLimit: 10,
	host: MysqlServ,
	user: 'sl',
	password: '',
	database: 'FileInv'
});

pool.query(
	{
		sql: "SELECT * FROM Volume"
	},
	function (err, rows, fields) {
		if (err) throw err;
	for(var i=0; i<rows.length; i++) {
		console.log(rows[i]);
	}
});
