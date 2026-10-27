import sys, json
D='/Users/todorbra/Projects/ReactLearning/react-mastery/02-react-rendering-and-internals/'
def apply(fn, pairs):
    p=D+fn; s=open(p).read(); n=0
    for old,new in pairs:
        c=s.count(old)
        if c!=1:
            print('FAIL',fn,c,old[:70]); continue
        s=s.replace(old,new); n+=1
    open(p,'w').write(s); print(fn,'applied',n,'/',len(pairs))
