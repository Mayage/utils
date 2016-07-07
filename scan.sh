#!/bin/bash
#
# used to scan existing projects
# 
# $1 project root;

if [ $# != 1 ];then
	echo -e "usage fault: need parameters";
	exit 1;
fi

AREASROUTE=$1/Areas;
cd ${AREASROUTE};

num=$((0));
areas=();
# ls -l |awk '/^d/ {areas[num]=$NF;}' num=$num areas=$areas ;

for dir in $(ls)
do
    if [ -d $dir ];then
    	areas[${num}]=$dir;
    	num=$((${num}+1));
    fi
done  