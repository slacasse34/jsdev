/**
 * Created by e1695936 on 2016-11-11.
 */
"option strict"

var DirList = [];
var FileList = [];
var fs = require('fs');
var mysql = require('mysql');   // npm install mysql

var connection = mysql.createConnection({
	host: '192.168.72.130',
	user: 'sl',
	password: '',
	database: 'FileInv'
});

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

function IgnoreDir(Dir) {
	return false;
}

function ScanDirTo(FromDir, NewDir, OnDir, OnFile) {
	var DirStat = fs.statSync(FromDir);
	var CurPath = FromDir;
	var CurItem;
	var i;
	var Tot = 0;
	var FileSize = 0;
	var CurDir = fs.readdirSync(FromDir);
	var CurEntry;

	Parent=NewDir(FromDir, DirStat);
	for (i = 0; i < CurDir.length; i++) {
		// CurItem=String(CurPath).endswith('\\') ? CurPath+'\\'+CurDir[i] : CurPath+'\\'+CurDir[i];
		CurItem = CurPath + '\\' + CurDir[i];
		CurEntry = fs.statSync(CurItem);
		if (CurEntry.isDirectory()) {
			if (IgnoreDir(CurItem))
				continue;
			DirList.push(CurItem);
			Tot += ScanDirTo(CurItem, NewDir, OnDir, OnFile);
			OnDir(CurItem, CurEntry, Tot);
		}
		else {
			FileList.push(CurEntry);
			FileSize += CurEntry.size >> 10;
			OnFile(CurItem, CurEntry);
		}
	}
	OnDir(FromDir, DirStat, Tot + FileSize);
	return Tot + FileSize;
}

function ScanDiskTo(FromDir, NewDir, OnDir, OnFile) {
	var Tot;

	DirList.push(FromDir);
	Tot = ScanDirTo(FromDir, NewDir, OnDir, OnFile);
	return Tot;
}

function NewDirEntryToDb(Filename, DirEntry) {
	var rv=0;
	console.log(Filename);
	return rv;
}

function UpdateDbDirEntry(Filename, DirEntry, Kb) {
	console.log(Filename);
	console.log(DirEntry.size, Kb);
}
function FileEntryToDb(Filename, DirEntry, Parent) {
	console.log(Filename);
	console.log(DirEntry.size);
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

var KbSize = ScanDiskTo(process.argv[2], NewDirEntryToDb, UpdateDbDirEntry, FileEntryToDb);
console.log(KbSize + ' Kb');
console.log('Filelist:' + FileList.length);
console.log('Dirlist:' + DirList.length);