#!/bin/bash

download() {
    curl "https://docs.google.com/spreadsheets/d/$1/export?format=zip&id=$1" --cookie "$(cat .cookie)" -L > tmp.zip
    unzip tmp.zip Sheet1.html
    mv Sheet1.html $2.html
    rm tmp.zip
}

if [[ $1 != quick ]]; then
    download 1BwpeFdYn3ez538CuOylWPoHogfGlGCfDffb2lmfRaKc ammo
    download 1QAUIDg_9bSrSqQSO_Xwmu8P24RAAib86ApVFHfJbFuE firearms
    download 1ZXp6dz1ByN8BuukCc6UgTU4JqqMG5NrjYmn7ObM5ejM examplearmor
    download 19Jl68KBJC00f1Q0Ha6iwoKMYkKT2xH-Toz7saXu7EKs examplefirearms
fi

pandoc -s --toc -c theme.css -T DUCK < index.md > index.html

for INSERT in $(grep %% index.md | tr -d %); do
    CONTENT=$( cat ${INSERT}.html | tr '\n' ' ' | sed 's/.*<table[^>]*>/<table>/i' | sed 's@</table>.*@</table>@i' | sed 's/\\/\\\\/g' | sed 's/&/\\&/g')
    sed -i "s@%%${INSERT}%%@${CONTENT}@" index.html
done

