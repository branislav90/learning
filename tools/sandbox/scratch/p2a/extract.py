import re,sys,os
f=sys.argv[1]; out=sys.argv[2]; os.makedirs(out,exist_ok=True)
s=open(f).read().split('\n')
i=0;n=0
while i<len(s):
    m=re.match(r'^```(ts|tsx|js|jsx|typescript)\s*$',s[i])
    if m:
        lang=m.group(1); j=i+1; blk=[]
        while not s[j].startswith('```'): blk.append(s[j]); j+=1
        n+=1; ext='tsx' if lang in('tsx','jsx') else 'ts'
        open(f'{out}/b{i+1:04d}.{ext}','w').write('\n'.join(blk)+'\n')
        i=j
    i+=1
print(n,'blocks')
