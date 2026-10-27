export {};
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal">
        <span className="x" onClick={onClose}>×</span>
        {children}
      </div>
    </div>
  );
}
