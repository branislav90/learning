import re,sys,subprocess,os
for f in sys.argv[1:]:
    t=open(f).read(); b=os.path.basename(f)[:2]
    for i,m in enumerate(re.finditer(r'```(js|javascript|ts)\n(.*?)```',t,re.S)):
        line=t[:m.start()].count('\n')+2
        p=f'{b}_{i}.ts'; open(p,'w').write(m.group(2))
        try:
            r=subprocess.run(['node','--experimental-strip-types',p],capture_output=True,text=True,timeout=10)
            st='ok' if r.returncode==0 else 'ERR '+r.stderr.strip().split('\n')[-1][:100]
        except Exception as e: st='TIMEOUT'
        print(b,i,'line',line,st)
