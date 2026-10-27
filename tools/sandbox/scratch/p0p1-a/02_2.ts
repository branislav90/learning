// app.js
const root = document.getElementById("root"); // null
createRoot(root!).render(<App />);            // TypeError: createRoot(...): Target container is not a DOM element
