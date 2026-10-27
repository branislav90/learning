export function Table({ guests }: { guests: readonly string[] }) {
  return (
    <ul>
      {guests.map((name, i) => (
        <li key={name}>Guest #{i + 1}: {name}</li>
      ))}
    </ul>
  );
}
