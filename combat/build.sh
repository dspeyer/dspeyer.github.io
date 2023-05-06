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
fi

pandoc -s --toc -c theme.css < index.md > tmp.html

AMMO=$( cat ammo.html | tr '\n' ' ' | sed 's/.*<table[^>]*>/<table>/i' | sed 's@</table>.*@</table>@i' | sed 's/&/\\&/g' )
FIREARMS=$( cat firearms.html | tr '\n' ' ' | sed 's/.*<table[^>]*>/<table>/i' | sed 's@</table>.*@</table>@i'  | sed 's/&/\\&/g')
EXAMPLEARMOR=$( cat examplearmor.html | tr '\n' ' ' | sed 's/.*<table[^>]*>/<table>/i' | sed 's@</table>.*@</table>@i'  | sed 's/&/\\&/g')

cat tmp.html | sed "s@%%ammo%%@${AMMO}@" | sed "s@%%firearms%%@${FIREARMS}@" | sed "s@%%examplearmor%%@${EXAMPLEARMOR}@" > index.html
