import sys
D="/Users/todorbra/Projects/ReactLearning/react-mastery/08-testing-and-quality/"
def apply(fname, edits):
    p=D+fname; t=open(p,encoding='utf-8').read(); bad=0
    for old,new in edits:
        c=t.count(old)
        if c!=1:
            print("FAIL(%d):"%c, fname, old[:80]); bad+=1; continue
        t=t.replace(old,new)
    open(p,'w',encoding='utf-8').write(t); print(fname,"applied",len(edits)-bad,"/",len(edits))
