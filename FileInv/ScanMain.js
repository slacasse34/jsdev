/**
 * Created by e1695936 on 2016-11-11.
 */
"option strict"

var DirList=[];
var FileList=[];
var fs = require('fs');

function ScanDirTo(FromDir, OnDir, OnFile) {
	var i;
	var CurPath=FromDir;
	var CurItem;
	var RootDir=fs.statSync(FromDir);

	DirList.push(FromDir);
	OnDir(FromDir, RootDir);
	CurDir=fs.readdirSync(FromDir);
	for(i=0; i<CurDir.length; i++) {
		CurItem=CurPath+'\\'+CurDir[i];
		console.log('stat('+CurItem+')');
		CurEntry=fs.statSync(CurItem);
		if(CurEntry.isDirectory()) {
			DirList.push(CurItem);
			OnDir(CurItem, CurEntry);
		}
		else {
			FileList.push(CurEntry);
			OnFile(CurItem, CurEntry);
		}
	}

	//for(CurDir=RootDir, i=0; i<DirList.length; i++, CurDir=DirList[i])
	return i;
}

function DirEntryToConsole(Filename,DirEntry) {
	console.log(Filename);
	console.log(DirEntry.size);
}
/*
 * Main()
 */
if(process.argv.length!=3) {
	console.log('Usage: '+process.argv[1]+' StartFolder');
	return;
}

ScanDirTo(process.argv[2], DirEntryToConsole, DirEntryToConsole);