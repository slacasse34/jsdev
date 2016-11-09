/**
 * Created by e1695936 on 2016-11-11.
 */
"option strict"

var DirList = [];
var FileList = [];
var fs = require('fs');

function IgnoreDir(Dir) {
	return false;
}

function ScanDirTo(FromDir, OnDir, OnFile) {
	var RootDir = fs.statSync(FromDir);
	var CurPath = FromDir;
	var CurItem;
	var i;
	var Tot=0;
	var FileSize=0;
	var CurDir = fs.readdirSync(FromDir);

	for (i = 0; i < CurDir.length; i++) {
		// CurItem=String(CurPath).endswith('\\') ? CurPath+'\\'+CurDir[i] : CurPath+'\\'+CurDir[i];
		CurItem = CurPath + '\\' + CurDir[i];
		CurEntry = fs.statSync(CurItem);
		if (CurEntry.isDirectory()) {
			if (IgnoreDir(CurItem))
				continue;
			DirList.push(CurItem);
			Tot += ScanDirTo(CurItem, OnDir, OnFile);
			OnDir(CurItem, CurEntry, Tot);
		}
		else {
			FileList.push(CurEntry);
			FileSize += CurEntry.size>>10;
			OnFile(CurItem, CurEntry);
		}
	}
	OnDir(FromDir, RootDir, Tot+FileSize);
	return Tot+FileSize;
}

function ScanDiskTo(FromDir, OnDir, OnFile) {
	var Tot;

	DirList.push(FromDir);
	Tot = ScanDirTo(FromDir, OnDir, OnFile);
	return Tot;
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

var KbSize=ScanDiskTo(process.argv[2], DirEntryToConsole, FileEntryToConsole);
console.log(KbSize+' Kb');
console.log('Filelist:' + FileList.length);
console.log('Dirlist:' + DirList.length);