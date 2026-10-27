import sys,re
f,pat=sys.argv[1],sys.argv[2]
a=int(sys.argv[3]) if len(sys.argv)>3 else 150
b=int(sys.argv[4]) if len(sys.argv)>4 else 250
n=int(sys.argv[5]) if len(sys.argv)>5 else 3
t=open(f).read()
c=0
for m in re.finditer('.{0,%d}%s.{0,%d}'%(a,pat,b),t):
    print('>>',m.group(0)); c+=1
    if c>=n: break
if c==0: print('>> NO MATCH',pat)
