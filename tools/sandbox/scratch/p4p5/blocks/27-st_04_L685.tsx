function Row({ highlight }: { highlight: boolean }) {
  const Cell = styled.td`background: ${highlight ? "yellow" : "white"};`;
  return <tr><Cell><input /></Cell></tr>;
}
export {};
