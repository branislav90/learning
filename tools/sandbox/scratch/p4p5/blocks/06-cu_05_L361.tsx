function FaqItem({ question, answer }: { question: string; answer: string }) {
  const { open, getButtonProps, getContentProps } = useDisclosure();
  return (
    <section>
      <h3><button {...getButtonProps()}>{question} {open ? "−" : "+"}</button></h3>
      <div {...getContentProps({ className: "answer" })}>{answer}</div>
    </section>
  );
}
export {};
