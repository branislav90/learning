<Boundary fallback={<p>Oops</p>}>
  <button onClick={() => { throw new Error("click"); }}>Go</button>
</Boundary>
export {};
