import subprocess,re,os,glob,shutil
os.makedirs('sb',exist_ok=True)
for f in glob.glob('sb/*'): os.remove(f)
libs=re.compile(r"from '(@tanstack/react-query|@reduxjs/toolkit|@reduxjs/toolkit/query/react|react-redux|zustand[^']*|xstate|@xstate/react)'")
cands=[f for f in glob.glob('blocks/*') if libs.search(open(f).read())]
for f in cands: shutil.copy(f,'sb/'+os.path.basename(f))
def run():
    r=subprocess.run(['npx','tsc','-p','tsconfig.sb.json'],capture_output=True,text=True)
    return r.stdout
open('tsconfig.sb.json','w').write(open('tsconfig.json').read().replace('blocks/*','sb/*'))
for it in range(3):
    out=run()
    need={}
    for m in re.finditer(r"^(sb/[^(]+)\(\d+,\d+\): error TS(2304|2552|2503|2749|2693): Cannot find (?:name|namespace) '([^']+)'",out,re.M):
        need.setdefault(m.group(1),set()).add(m.group(3))
    for f,names in need.items():
        txt=open(f).read()
        stub=''.join(f"declare const {n}: any; type {n}<T=any,U=any,V=any> = any;\n" for n in names if n[0].isalpha() and n not in ('describe','it','expect','test','vi','window','document'))
        open(f,'w').write(stub+txt)
out=run()
skip=('TS7006','TS7031','TS2307','TS2451','TS2393','TS2300','TS2528','TS2440','TS2593','TS2304','TS2552','TS2339','TS18046')
for l in out.splitlines():
    if l.startswith('sb/') : print(l[:300])
