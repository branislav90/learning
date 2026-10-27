// (a)
cond ? <Counter /> : <Counter />
// (b)
cond ? <div><Counter /></div> : <Counter />
// (c)
cond ? <Counter key="x" /> : <Counter key="y" />
// (d)
<>{cond && <Banner />}<Counter /></>
// (e)
cond ? <><Banner /><Counter /></> : <><Counter /></>
