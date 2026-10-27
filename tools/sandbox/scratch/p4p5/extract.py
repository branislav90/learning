import re,os,sys,glob
R='/Users/todorbra/Projects/ReactLearning/react-mastery/'
out='blocks'; os.makedirs(out,exist_ok=True)
for f in glob.glob(R+'04-react-architecture/*.md')+glob.glob(R+'05-design-patterns/*.md'):
    base=os.path.basename(f)[:5]+'_'+f.split('/')[-2][:2]
    s=open(f).read().split('\n')
    i=0;n=0
    while i<len(s):
        m=re.match(r'^```(tsx|ts|typescript)\s*$',s[i])
        if m:
            j=i+1;body=[]
            while j<len(s) and not s[j].startswith('```'): body.append(s[j]);j+=1
            n+=1
            ext='tsx' if m.group(1)=='tsx' or any('<' in l and '/>' in l for l in body) else 'ts'
            open(f'{out}/{base}_L{i+1}.{ext}','w').write('\n'.join(body)+'\nexport {};\n')
            i=j
        i+=1
