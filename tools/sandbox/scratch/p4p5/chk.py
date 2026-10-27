import subprocess,concurrent.futures as cf
urls=[u.strip() for u in open('urls.txt')]
def f(u):
    try:
        c=subprocess.run(['curl','-sL','-o','/dev/null','-m','25','-A','Mozilla/5.0','-w','%{http_code}',u],capture_output=True,text=True).stdout
    except Exception as e: c='ERR'
    return c,u
with cf.ThreadPoolExecutor(12) as ex: res=list(ex.map(f,urls))
open('urlstatus.txt','w').write('\n'.join(f'{c} {u}' for c,u in res))
for c,u in res:
    if c!='200': print(c,u)
