type ModalProps = {
  open: boolean;
  onClose(): void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

function Modal({ open, onClose, children, footer }: ModalProps) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true">
      <div>{children}</div>
      <div>{footer ?? <button onClick={onClose}>Close</button>}</div>
    </div>
  );
}

function ConfirmModal({ open, onClose, onConfirm }: { open: boolean; onClose(): void; onConfirm(): void }) {
  return (
    <Modal open={open} onClose={onClose} footer={<><button onClick={onConfirm}>Yes</button><button onClick={onClose}>No</button></>}>
      <p>Are you sure?</p>
    </Modal>
  );
}
export {};
