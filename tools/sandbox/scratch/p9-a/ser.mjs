const ser=d=>JSON.stringify(d).replace(/</g,"\\u003c").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029");
const x={a:"</script><script>alert(1)</script>",b:"x\u2028y\u2029z",c:"<!--"};
const s=ser(x);console.log(s,!s.includes("</script>"),JSON.stringify(JSON.parse(s))===JSON.stringify(x));
