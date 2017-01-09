APP=/cygdrive/e/CEGEP/ProgServeur/jsdev/sh/LoadDir.sh
find $2 -type d|awk -vQ=\" -vAPP="$APP " -vVOL=$1 '{print APP VOL,NR,Q $0 Q}' |bash -s
