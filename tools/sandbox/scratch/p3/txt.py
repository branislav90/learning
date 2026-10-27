import sys,re,html,urllib.request
h=urllib.request.urlopen(urllib.request.Request(sys.argv[1],headers={'User-Agent':'x'})).read().decode()
h=re.sub(r'<(script|style)[^>]*>.*?</\1>','',h,flags=re.S)
h=re.sub(r'</(p|li|h\d|pre|div)>','\n',h)
h=html.unescape(re.sub(r'<[^>]*>','',h))
print(re.sub(r'\n\s*\n+','\n',h))
