#!/bin/bash
for i in *.md; do pandoc $i -o $(echo $i | sed 's/md/html/') -t html4 -T "$(head -n 1 $i | tr -d '#')" -c theme.css; done
