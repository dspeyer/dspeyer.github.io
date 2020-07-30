#!/bin/bash

rm *.html tmp/*.html

for i in raw/*.txt; do
    pandoc $i > tmp/`basename $i .txt`.html
done

for i in raw/*.html; do
    perl -e '$b=0;while(<>){if (/body/) {$b=1;} elsif ($b and not /html/) {print;}}' < $i > tmp/`basename $i`;
done

echo '<html><head><title>HorrorMon Index</title><link rel=stylesheet href=theme.css></head><body>' > index.html
echo '<table>' >> index.html
echo "<thead><tr><!--td class=small>#</td--><td class=sarah>Sarah's Diary</td><td class=otto>Otto's Log</td><td class=citrine>Citrine's Journal</td><td class=historian>Additional Texts</td></tr></thead>" >> index.html
for i in `ls tmp/*_*.html | cut -d _ -f 2 | sort -n | uniq`; do
    echo "<tr><!--td class=small>${i}</td-->" >> index.html
    if test $i -eq '-1'; then
        echo "<td class=invis colspan=3></td>" >> index.html
    fi
    if test $i -eq 14; then
        echo "<td class=invis style='border:none' rowspan=3></td>" >> index.html
    fi
    for n in sarah otto citrine marianna jacqueline historian; do
        FN=`echo tmp/${n}_${i}_*`
        if test -e $FN; then
            RS=`echo $FN | sed 's/.*_//g' | sed 's/.html//'`
            T=`grep -i '<h1' $FN | head -n 1 | sed 's/<[^>]*>//g'`
            if echo $n | egrep -v 'sarah|otto|citrine' >/dev/null; then
                T="<div class=author>${n}'s account:</div> $T";
            fi
            if test `wc -l $FN | cut -f 1 -d ' '` -gt 1; then
                HREF="href=`basename $FN`"
                CL="$n"
            else
                HREF=""
                CL="small"
            fi
            echo "<td rowspan=${RS} class=${CL}><a $HREF >${T}</a></td>" >> index.html
            echo "<html><head><title>$T - ${n^} - HorrorMon</title><link rel=stylesheet href=theme.css></head><!--${CL}--><body class=$n><div class=content>" > `basename $FN`
            cat $FN >> `basename $FN`
        fi
    done
    echo "</tr>" >> index.html
done
echo "</table></body></html>" >> index.html

./makelinks.py
