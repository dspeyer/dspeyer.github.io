#!/usr/bin/python

import json
import requests
import re
from html.parser import HTMLParser
from html.entities import name2codepoint
import urllib
import os
import sys
from hashlib import sha256
from markdown import markdown
from datetime import datetime
import dateutil.parser
import pickle
from feedgen.feed import FeedGenerator
import pytz
import subprocess

name='daniel.speyer'
cookie=open('/home/dspeyer/fbcookie').read()
chrome='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36'

url = 'https://mbasic.facebook.com/'+name
if len(sys.argv) > 1:
    url = sys.argv[1]

resp=requests.get(url, headers={'cookie':cookie,'user-agent':chrome})

topost=[]

class FBSParser(HTMLParser):
    def __init__(self,url):
        HTMLParser.__init__(self)
        self.state = None
        self.stack = []
        self.linktitle = ''
        self.titleprefix = ''
        self.text = ''
        self.link = None
        self.url = url
        self.photos = 0
        self.hasvideo = False
        self.typ = 'TEXT'
        self.taggedme = False
        self.date = ''
        
    def handle_starttag(self, tag, attrs):
        attrs = { k:v for k,v in attrs }
        if tag in {'div','span','h3','header'}:
            self.stack.append(self.state)
        klass = attrs.get('class','')
        #print("%s[%s]<%s '%s'>"%("."*len(self.stack), self.state, tag, klass))
        if self.state == 'comments':
            return
        if tag in ['div','article']:
            if klass in {'bm bn','bq br'}:
                self.state = 'linktable'
                self.typ = 'LINK'
                #print "<IN LINKTABLE>"
            elif klass in {'bl','bs','bw'}:
                self.state = 'body'
            elif klass.startswith('bo bp') or klass in {'bf', 'bt bu', 'bv bw'}:
                self.state = 'photobox'
                self.typ = 'PHOTO'
            elif klass in {'dc bz', 'dg cd', 'dh cd'}:
                self.state = 'comments'
            #print 'klass="%s" state: %s -> %s' % (klass, self.stack[-1], self.state)
        if tag=='header' and self.state!='comments':
            #print('entering header from %s'%self.state)
            self.state = 'header'
        if tag=='h3' and self.state=='linktable':
            self.state = 'linktext'
        if tag=='span' and klass=='bp':
            self.state = 'body'
        if tag=='a':
            if self.state=='photobox' or attrs['href'].startswith('/photo.php?fbid='):
                self.photos += 1
                if self.link:
                    self.link = self.url
                elif attrs['href'].startswith('/photo.php?fbid='):
                    self.link = 'https://facebook.com' + attrs['href'].split('&')[0]
                else:
                    self.link = 'https://facebook.com' + attrs['href']
            if self.state=='linktable':
                #print('parsing <<%s>> in linktable'%attrs['href'])
                try:
                    pieces = attrs['href'].split('?')[1].split('&')
                    #print('LINKTABLE\n'+attrs['href']+'\n'+' '.join(pieces))
                    up = [ s[2:] for s in pieces if s[:2]=='u=' ]
                    url = urllib.parse.unquote(up[0])
                    self.link = re.sub('fbclid=[a-zA-Z0-9_-]*&?','',url)
                except IndexError:
                    self.link = self.url
            if attrs['href'].startswith('/video_redirect/'):
                self.hasvideo = True
                if self.link:
                    self.link = self.url
                else:
                    self.link = 'https://mbasic.facebook.com' + attrs['href']
        if tag=='br' and self.state=='body':
            self.text += '    \n'
        if tag=='abbr' and self.state!='commeents':
            self.state = 'date'
        #if len(self.stack) and self.state != self.stack[-1]:
            #print('  := %s' % self.state)
        #print(tag,klass,self.state)
            
    def handle_endtag(self, tag):
        if tag in {'div','span','h3','header'}:
            self.state = self.stack.pop()
        if tag=='p' and self.state in {'body', 'photobox'}:
            self.text += '\n\n'
        #print('/',tag,self.state)

    def handle_data(self, data):
        if self.state == 'comments':
            return
        #print 'Got "%s" in %s' % (data,self.state)
        #print('"%s..."'%data[:20])
        if self.state=='linktext':
            self.linktitle += data.strip()
        if self.state=='date':
            self.date += data.strip()
        if self.state in {'body', 'photobox'}:
            self.text += data
        if self.state=='header':
            if data.strip() == 'Daniel Speyer' and self.titleprefix == '':
                self.state = 'irrelevantheader'
            elif re.sub('[0-9]+','#',data.strip()) not in ['Edit', 'Delete', 'View Edit History', '>','Daniel Speyer', 'added', 'to the album:', '# new photos', 'with', 'is with', '— with', u'\xb7',u'\u200e']:
                self.titleprefix += data.strip()
            elif 'with' in data:
                self.taggedme = True
            
    def handle_entityref(self, name):
        if self.state == 'comments':
            return
        c = unichr(name2codepoint[name])
        self.handle_data(c)

    def handle_charref(self, name):
        if self.state == 'comments':
            return
        if name.startswith('x'):
            c = unichr(int(name[1:], 16))
        else:
            c = unichr(int(name))
        self.handle_data(c)


def submit(title, body, date, url):
    try:
        date = dateutil.parser.parse(date, fuzzy=True)
    except ValueError:
        date = datetime.now()
    #print('\n------------------------------\n##%s\n\n%s\n-----------------\n'%(title,body))
    #return
    req = {"title":title,"content":markdown(body),"date":date,"url":url}
    topost.append(req)
        
allmatches = re.findall('<a href="(/story.php[^"#]*)#?[a-z_]*">Full Story</a>', resp.text)

#allmatches = allmatches[:3]
#allmatches=['']

for match in allmatches:
    sk = 'fbseen/'+re.sub('[^a-zA-Z0-9]','_',match)[:30]
    if os.path.exists(sk):
        print("quitting: %s exists"%sk)
        continue
    open(sk,'w')
    url = 'https://mbasic.facebook.com'+match.replace('&amp;','&')
    resp2 = requests.get(url, headers={'cookie':cookie, 'user-agent':chrome})
    print( url)
    open('/home/dspeyer/fbdbg.html','w').write(resp2.text)
    #print( resp2.text)
    p = FBSParser(url)
    p.feed(resp2.text)
    print( p.typ)
    print( p.link)
    #print( p.text)
    print(json.dumps(p.__dict__, default=lambda _:"n/a", indent=2))
#    sys.exit(0)

    contentkey = repr((p.linktitle, p.titleprefix, p.text, p.link))
    h = 'fbseen/content_'+sha256(contentkey.encode('utf-8')).hexdigest()
    if os.path.exists(h):
        print("quitting: %s exists"%h)
        continue
    open(h,'w').write(contentkey)
    contentkey = repr((p.linktitle, p.titleprefix, p.text))
    h = 'fbseen/content_'+sha256(contentkey.encode('utf-8')).hexdigest()
    if os.path.exists(h):
        print("quitting: %s exists"%h)
        continue
    open(h,'w').write(contentkey)

    title = ''
    for line in p.text.split('\n'):
        if line.strip() != '' and not line.startswith('['):
            title = line
            break
    if not title and p.linktitle:
        title = p.linktitle
    if not title and p.link and '/photo' in p.link:
        title = 'Untitled Photo'
    if not title:
        title = 'Untitled'
    if p.titleprefix:
        title = '[%s%s] %s' % (p.titleprefix,(p.taggedme and ' tagged me' or '->me'),title)
    if len(title) > 200:
        for sym in '.:;, ':
            i = title[:200].rfind(sym)
            if i > 100:
                title=title[:i]
                break
        else:
            title = title[:196]+'...'
    title = title.rstrip()
    if title.endswith(':'):
        title=title[:-1]
    body = p.text
    if p.link:
        if p.linktitle:
            lt = p.linktitle
        elif p.photos > 1:
            lt = '%d Photos' % p.photos
        elif '/photo' in p.link:
            lt = 'Photo'
        else:
            lt = 'Link '
        if p.link.startswith('https://lm.facebook.com/l.php?u='):
            link = urllib.parse.unquote(p.link.split('?u=')[1].split('%3Ffbclid%3D')[0])
        else:
            link = p.link
        body += '\n\n## [See %s](%s)\n' % (lt, link)
    submit(title, body, p.date, url)
        
if not len(topost):
    sys.exit(0)
        
subprocess.run(['git', 'pull'], cwd='/home/dspeyer/fbstuff/dspeyer.github.io/fbmirror', check=True)
        
newstuff='        <!-- new stuff goes here -->'
newposts = open('/home/dspeyer/fbstuff/dspeyer.github.io/fbmirror/new-posts.html').read()
try:
    rss=pickle.load(open('/home/dspeyer/fbstuff/rss.pickle','rb'))
except (FileNotFoundError, EOFError) as e:
    rss=[]
for req in reversed(topost):
    newposts = newposts.replace(newstuff, '%s\n<div class=post>\n<h6>%s</h6>\n%s\n<span class=date>%s</span></div>\n\n'%(newstuff, req['title'], req['content'], req['date'].strftime('%b %d %-I:%M%p')))
    rss = [req] + rss
open('/home/dspeyer/fbstuff/dspeyer.github.io/fbmirror/new-posts.html','w').write(newposts)
rss = rss[:20]
fg = FeedGenerator()
fg.id('https://dspeyer.github.io/fbmirror/rss.xml')
fg.title("Daniel Speyer's Facebook")
fg.description("Daniel Speyer's Facebook")
fg.author( {'name':'Daniel Speyer','email':'dspeyer@gmail.com'} )
fg.language('en')
fg.link({"href":'https://dspeyer.github.io/fbmirror/new-posts.html', "rel":"alternate"})

for req in rss:
    fe = fg.add_entry()
    fe.title(req['title'])
    fe.content(req['content'])
    fe.pubDate(pytz.utc.localize(req['date']))
    fe.link({"href":req['url'],"rel":"alternate"})
fg.rss_file('/home/dspeyer/fbstuff/dspeyer.github.io/fbmirror/rss.xml')
pickle.dump(rss, open('/home/dspeyer/fbstuff/rss.pickle','wb'))

subprocess.run(['git', 'commit', 'new-posts.html', 'rss.xml', '-m', 'fbmirror'], cwd='/home/dspeyer/fbstuff/dspeyer.github.io/fbmirror', check=True)
subprocess.run(['git', 'push'], cwd='/home/dspeyer/fbstuff/dspeyer.github.io/fbmirror', check=True)
