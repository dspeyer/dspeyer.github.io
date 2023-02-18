#!/bin/bash

pandoc -s --toc -c theme.css < index.md > tmp.html

AMMO=$( cat ammo.html | tr '\n' ' ' | sed 's/.*<table[^>]*>/<table>/i' | sed 's@</table>.*@</table>@i' | sed 's/&/\\&/g' )
FIREARMS=$( cat firearms.html | tr '\n' ' ' | sed 's/.*<table[^>]*>/<table>/i' | sed 's@</table>.*@</table>@i'  | sed 's/&/\\&/g')

cat tmp.html | sed "s@%%ammo%%@${AMMO}@" | sed "s@%%firearms%%@${FIREARMS}@" > index.html
