#!/bin/bash
#	$1:	VolId
#	$2:	DirId
#	$3	DirFSpec
MYSQL=">>/tmp/LoadDir.out"
cd $3
TMP=/tmp/LoadDir.txt
echo INSERT INTO DirEntry VALUES \(DEFAULT,$1,\'$3\'\)\;
CURDIR=$2
# stat all in dir
stat -c%F,$1,$CURDIR,DEFAULT,%N,%s,%b,%B,%i,%h,%a,%u,%g,%X,%Y,%Z,0,$FILEINFO *>$TMP
#Keep only regular files
awk -F, -vOFS=, '$1 ~ /regular file/ {print "INSERT INTO FileEntry VALUES (" $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18 ");"}' $TMP
TOTKB=`awk -F, '$1 ~ /regular file/ {T+=$6} END {print int(T/1024)}' $TMP`
echo UPDATE DirEntry SET KbSize=$TOTKB WHERE DirId=$CURDIR\;
