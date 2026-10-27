const input = document.querySelector("input")!;
input.focus();                  // user types "hello"
app.innerHTML = renderApp(state);  // naive "re-render by string"
// The old input is gone. The new input is empty and unfocused.
