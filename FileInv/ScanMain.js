/**
 * Created by e1695936 on 2016-11-11.
 */
"option strict"

var MysqlServ = '192.168.72.131';
var DirList = [];
var FileList = [];
var fs = require('fs');
var mysql = require('mysql');   // npm install mysql
var BatchFile = require('child_process');
//var sleep = require('sleep');

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
/*
 connection.connect(function(err){
 if(err) throw err;
 connection.query(
 {
 sql: 'select * from FileInfo'
 },
 function(err, rows, fields) {
 if(err) throw err;
 console.log('Input!');
 for(var a=0; a<rows.length; a++){
 console.log(rows[a]);
 }
 connection.end();
 }
 )
 });
 */
function IgnoreDir(Dir) {
	return false;
}

function ScanDirTo(FromDir, NewDir, OnDir, OnFile, Volume) {
	var DirStat = fs.statSync(FromDir);
	var CurPath = FromDir;
	var CurItem;
	var i;
	var Tot = 0;
	var FileSize = 0;
	var CurDir = fs.readdirSync(FromDir);
	var CurEntry;

	Parent = NewDir(FromDir, DirStat, Volume);
	for (i = 0; i < CurDir.length; i++) {
		// CurItem=String(CurPath).endswith('\\') ? CurPath+'\\'+CurDir[i] : CurPath+'\\'+CurDir[i];
		CurItem = CurPath + '\\' + CurDir[i];
		CurEntry = fs.statSync(CurItem);
		if (CurEntry.isDirectory()) {
			if (IgnoreDir(CurItem))
				continue;
			DirList.push(CurItem);
			Tot += ScanDirTo(CurItem, NewDir, OnDir, OnFile, Volume);
			OnDir(CurItem, CurEntry, Tot);
		}
		else {
			FileList.push(CurEntry);
			FileSize += CurEntry.size >> 10;
			OnFile(CurItem, CurEntry, Volume, Parent);
		}
	}
	OnDir(FromDir, DirStat, Tot + FileSize);
	return Tot + FileSize;
}

/* Infinite loop
function GetLastVolId() {
	var rv = 0;
	var i = 0;

	connection.query(
		{
			sql: 'SELECT MAX(VolId) FROM Volume'
		},
		function (err, rows, fields) {
			if (err) throw err;
			rv = rows[0];
		});
	for (i = 0; rv == 0; i++);
	//	sleep.usleep(1000);
	console.log('GetLastVolId() ==>' + rv + ' in ' + i + ' iterations');
	return rv;
}
*/
function GetLastVolId(callback) {
	var rv = 0;

	connection.query(
		{
			sql: 'SELECT MAX(VolId) FROM Volume'
		},
		function (err, rows, fields) {
			if (err) throw err;
			rv = rows[0];
			callback(err, rv);
		});

}
/*********************************************
 * Original ScanDiskTo
 * nodejs can't provide arguments to sub-programs on the command line,
 * nor thru the environnement
 * Use manual invocation instead
 */
var VolId;
function ScanDiskTo(FromDir, NewDir, OnDir, OnFile) {
	var Tot;
	var VolInsert = "..\\Volume.bat";
	var ChildArgs = [FromDir, MysqlServ];

	// Need to use an external script to add Volume information
	//console.log(BatchFile.env.);
	BatchFile.execFileSync(VolInsert, ChildArgs);
	// Need to get back the Volume Id
	GetLastVolId(function (err,value) {VolId=value;});
	// Load folders
	DirList.push(FromDir);
	Tot = ScanDirTo(FromDir, NewDir, OnDir, OnFile, VolId);
	return Tot;
}

/*
 function ScanDiskTo(FromDir, NewDir, OnDir, OnFile) {
 var VolId;
 var Tot;

 VolId=GetLastVolId();
 // Load folders
 DirList.push(FromDir);
 Tot = ScanDirTo(FromDir, NewDir, OnDir, OnFile, VolId);
 return Tot;
 }
 */

function NewDirEntryToDb(Filename, DirEntry, Volume) {
	var rv = 0;
	var i = 0;
	var Entry = {
		VolId: Volume,
		Path: Filename
	};
	//console.log(Filename);
	connection.query(
		{
			sql: "INSERT INTO DirEntry SET ?",
			values: Entry
		},
		function (err, rows, fields) {
			if (err) throw err;
			rv = row.insertId;
			console.log("added " + rv);
		}
	);
	for (i = 0; rv == 0 /*&& i<60000*/; i++);
	//	sleep.usleep(1000);
	console.log('NewDirEntryToDb() ==>' + rv + ' in ' + i + ' iterations');
	return rv;
}

function UpdateDbDirEntry(Filename, DirEntry, Id, Kb) {
	var rv = 0;
	//console.log(Filename);
	connection.query(
		{
			sql: "UPDATE DirEntry SET KbSize=? WHERE DirId=?",
			values: [Kb, Id]
		},
		function (err, rows, fields) {
			if (err) throw err;
			rv = 0;
			console.log("Updated dir #" + Id);
		}
	);
	return rv;
}
function FileEntryToDb(Filename, DirEntry, Volume, Parent) {
	var rv = 0;
	var Entry = {
		VolId: Volume,
		DirId: Parent,
		FileName: Filename,
		Size: DirEntry.size,
		Blocks: DirEntry.blocks,
		IOBlock: DirEntry.blocksize,
		Inode: DirEntry.ino,
		Links: DirEntry.nlink,
		Access: DirEntry.Access,
		Uid: DirEntry.uid,
		Gid: DirEntry.gid,
		TAccess: DirEntry.atime,
		TModif: DirEntry.mtime,
		TChange: DirEntry, ctime,
		TBirth: DirEntry.birthtime,
		FileInfo: 230775901

	};
	//console.log(Filename);
	connection.query(
		{
			sql: "INSERT INTO FileEntry SET ?",
			values: Entry
		},
		function (err, rows, fields) {
			if (err) throw err;
			rv = row.insertId;
			console.log('FileEntryToDb() ==>' + rv);
		}
	);
	return rv;
}


/* Debug */
function DirEntryToConsole(Filename, DirEntry, Kb) {
	console.log(Filename);
	console.log(DirEntry.size, Kb);
}

function FileEntryToConsole(Filename, DirEntry) {
	console.log(Filename);
	console.log(DirEntry.size);
}

/*
 * Main()
 */
if (process.argv.length != 3) {
	console.log('Usage: ' + process.argv[1] + ' StartFolder');
	return;
}
if (process.env.MYSQLSERV != undefined)
	MysqlServ = process.env.MYSQLSERV;
if (DbConnect(undefined))
	return;
var KbSize = ScanDiskTo(process.argv[2], NewDirEntryToDb, UpdateDbDirEntry, FileEntryToDb);
console.log(KbSize + ' Kb');
console.log('Filelist:' + FileList.length);
console.log('Dirlist:' + DirList.length);
DbDisconnect();