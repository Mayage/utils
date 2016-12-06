
FILES=` find . -name config.json |grep 10.4`
echo `cat ${FILES}`

cat ${FILES}|tee > a.json


