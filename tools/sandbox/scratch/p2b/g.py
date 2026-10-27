import sys,re
f,pat=sys.argv[1],sys.argv[2]
s=re.sub(r'\s+',' ',open('/Users/todorbra/Projects/ReactLearning/tools/sandbox/scratch/p2b/docs/'+f+'.txt').read())
for m in list(re.finditer(pat,s,re.I))[:int(sys.argv[3]) if len(sys.argv)>3 else 4]:
    print('...',s[max(0,m.start()-250):m.end()+300],'\n')
