#!/usr/bin/python3

from glob import glob
from collections import defaultdict
from re import sub
from itertools import count

fns = glob('*_*_*.html')
raw = []
for fn in fns:
    try:
        author,tick,length = fn[:-5].split('_')
    except ValueError:
        print('Skipping "%s"'%fn[:-5])
        continue
    tick = int(tick)
    length = int(length)
    f = open(fn,'r')
    title = 'untitled'
    stub = False
    for l in f:
        if '<!--small-->' in l:
            stub = True
        if 'h1' in l:
            title = sub('<[^>]*>','',l.strip())
            break
    f.close()
    raw.append({'author':author,'tick':tick,'length':length,'title':title,'fn':fn,'stub':stub})

    
bytime = defaultdict(list)
bytimeauth = {}

for x in raw:
    for i in range(x['length']):
        bytime[x['tick']+i].append(x)
        bytimeauth[(x['tick']+i,x['author'])] = x

for x in raw:
    f = open(x['fn'],'a')
    f.write('</div><hr><div class=content><h3>Navigation:</h3><ul>')
    
    search = True
    if (x['tick']-1,x['author']) in bytimeauth:
        p = bytimeauth[(x['tick']-1,x['author'])]
        if p['stub']:
            f.write('<li><b>Previously:</b> <a href=%s>%s</a> [stub]'%
                    (p['fn'],p['title']))
        else:
            f.write('<li><b>Previously:</b> <a href=%s>%s</a>'%
                    (p['fn'],p['title']))
            search = False
    if search:
        for i in count(2,1):
            if (x['tick']-i,x['author']) in bytimeauth:            
                p = bytimeauth[(x['tick']-i,x['author'])]
                if not p['stub']:
                    f.write('<li><b>Previously with substance in this Account:</b> <a href=%s>%s</a>'%(p['fn'],p['title']))
                    break
            if x['tick']-i not in bytime:
                break
        for a in ['sarah','otto','citrine','historian']:
            if (x['tick']-1,a) in bytimeauth:
                p = bytimeauth[(x['tick']-1,a)]
                if not p['stub']:
                    f.write('<li><b>Immediately Previously by %s:</b> <a href=%s>%s</a>'%(a.title(), p['fn'],p['title']))
                    break

    seen = { x['fn'] }
    for i in range(x['length']):
        for y in bytime[x['tick']+i]:
            if y['fn'] in seen or y['stub']:
                continue
            f.write('<li><b>Concurrently by %s:</b> <a href=%s>%s</a>'%(y['author'].title(), y['fn'],y['title']))
            seen.add(y['fn'])

    # TODO: unify
    search = True
    if (x['tick']+x['length'],x['author']) in bytimeauth:
        p = bytimeauth[(x['tick']+x['length'],x['author'])]
        if p['stub']:
            f.write('<li><b>Next:</b> <a href=%s>%s</a> [stub]'%(p['fn'],p['title']))
        else:
            f.write('<li><b>Next:</b> <a href=%s>%s</a>'%(p['fn'],p['title']))
            search = False
    if search:
        for i in count(1,1):
            if (x['tick']+x['length']+i,x['author']) in bytimeauth:            
                p = bytimeauth[(x['tick']+x['length']+i,x['author'])]
                if not p['stub']:
                    f.write('<li><b>Next substantive in this Account:</b> <a href=%s>%s</a>'%(p['fn'],p['title']))
                    break
            if x['tick']+x['length']+i not in bytime:
                break
        for a in ['sarah','otto','citrine','historian']:
            if (x['tick']+x['length'],a) in bytimeauth:
                p = bytimeauth[(x['tick']+x['length'],a)]
                if not p['stub']:
                    f.write('<li><b>Immediately Next by %s:</b> <a href=%s>%s</a>'%(a.title(), p['fn'],p['title']))
                    break

    f.write('<li><b><a href=index.html>Index</a></b>')
    f.write('</ul></div></body></html>')
    f.close()
