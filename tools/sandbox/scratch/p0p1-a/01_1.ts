// "Make it async so it doesn't block"
async function expensive() {
  for (let i = 0; i < 1e9; i++) {}
}
button.onclick = async () => { await expensive(); };
