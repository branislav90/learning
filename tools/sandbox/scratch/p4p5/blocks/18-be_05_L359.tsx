function FaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  const d = useDisclosure();
  return (
    <div className="faq">
      <button {...d.getTriggerProps({ className: 'faq__q' })}>{question}</button>
      <div {...d.getPanelProps({ className: 'faq__a' })}>{children}</div>
    </div>
  );
}
export {};
