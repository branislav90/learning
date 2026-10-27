import sys,re,urllib.request
t=urllib.request.urlopen(urllib.request.Request(sys.argv[1],headers={'User-Agent':'x'})).read().decode()
t=re.sub(r'<[^>]*>',' ',t);t=re.sub(r'\s+',' ',t)
for m in list(re.finditer(sys.argv[2],t))[:int(sys.argv[3]) if len(sys.argv)>3 else 4]: print('..',t[max(0,m.start()-120):m.end()+160])
