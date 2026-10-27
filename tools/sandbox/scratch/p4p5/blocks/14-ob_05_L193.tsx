// INCORRECT
function ShortcutHandler({ onSave }: { onSave: () => void }) {
  useEffect(() => {
    window.addEventListener('keydown', (e) => {          // inline arrow
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); onSave(); }
    });
    // no cleanup
  }, []);                                                // onSave captured from first render
  return null;
}
export {};
