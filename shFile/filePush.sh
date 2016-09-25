#!/bin/bash
NAME="systemsetting"
DOMAIN="systemsetting.ivi.com";
LINK="page://${DOMAIN}/${NAME}";
DESTDIR="/data/opt/app/${DOMAIN}";


# grep -E "\.\/Areas|\.\/Libs|\.\/Services|\.\/VehicleConfig|\.\/index.js|\.\/manifest.json"
funmd5_1() {
	find . -type f |sed '/node_modules/d'|sed '/01_relatedData/d'|sed '/\.git/d'|sed '/remote.sh/d'|sed '/filePush.sh/d'|sed '/^\.\/\../d'|xargs md5sum > .funmd5_1.log
}
funmd5_2() {
	find . -type f |sed '/node_modules/d'|sed '/01_relatedData/d'|sed '/\.git/d'|sed '/remote.sh/d'|sed '/filePush.sh/d'|sed '/^\.\/\../d'|xargs md5sum > .funmd5_2.log
}

if [ ! -f .funmd5_1.log ];then
	echo "funmd5_1 file init"
	funmd5_1
fi

funmd5_2
diff .funmd5_1.log .funmd5_2.log > .diff.log
Status=$?
if [ $Status = 0 ];then
	echo "no file changes"
	adb shell killall ${NAME};
	adb shell sendlink ${LINK};
	rm .funmd5_2.log
exit
else
	echo "file changes & funmd5_1 file update"
	mv .funmd5_2.log .funmd5_1.log
	FILES=` cat .diff.log | grep "\.\/"|awk '{print $3}'`
	echo $FILES

	tar -cf ${DOMAIN}.tar ${FILES}

	adb push ${DOMAIN}.tar /tmp;
	adb shell tar -xf /tmp/${DOMAIN}.tar -C ${DESTDIR};
	adb shell sync;
	adb shell killall ${NAME};
	adb shell sendlink ${LINK};

	if [ -e ${DOMAIN}.tar ];then
		rm ${DOMAIN}.tar;
		sync;
	fi
fi


