async function a() { try { return Promise.reject(new Error("x")); } catch { return "caught"; } }
async function b() { try { return await Promise.reject(new Error("x")); } catch { return "caught"; } }
async function c() { try { Promise.reject(new Error("x")); } catch { return "caught"; } return "no error"; }
a().then(console.log,e=>console.log('a rejects')); b().then(console.log); c().then(console.log);
process.on('unhandledRejection',()=>console.log('unhandled'));
