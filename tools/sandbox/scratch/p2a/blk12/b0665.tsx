interface Guest { id: string; name: string }

export function Table({ guests }: { guests: readonly Guest[] }) {
  return (
    <ol>
      {guests.map((g) => (
        // <ol> numbers automatically; position is derived, not counted
        <li key={g.id}>{g.name}</li>
      ))}
    </ol>
  );
}
