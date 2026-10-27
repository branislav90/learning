import re,glob,sys
d='/Users/todorbra/Projects/ReactLearning/react-mastery/03-react-state-and-hooks/'
for n in ['19','20','21','22','23']:
    t=open(glob.glob(d+n+'-*.md')[0]).read()
    blocks=re.findall(r'```(?:tsx|ts)\n(.*?)```',t,re.S)
    for i,b in enumerate(blocks):
        if 'from \'react' in b or 'use' in b:
            ext='tsx'
            open(f'tc/L{n}_{i:02d}.{ext}','w').write('export {};\n'+b if 'import' not in b and 'export' not in b else b)
