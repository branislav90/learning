import sys, glob
D='/Users/todorbra/Projects/ReactLearning/react-mastery/06-data-fetching-and-state-ecosystems/'
def apply(prefix, pairs):
    f=glob.glob(D+prefix+'*.md')[0]
    t=open(f).read()
    for o,n in pairs:
        c=t.count(o)
        if c!=1:
            print('FAIL',prefix,c,o[:80]); continue
        t=t.replace(o,n)
    open(f,'w').write(t)
    print('done',prefix)
