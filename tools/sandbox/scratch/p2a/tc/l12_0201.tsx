let guestCount = 0;

function Guest() {
  guestCount += 1;                          // ❌ module-level mutation
  return <li>Guest #{guestCount}</li>;
}

export function Table() {
  return (
    <ul>
      <Guest />
      <Guest />
      <Guest />
    </ul>
  );
}
