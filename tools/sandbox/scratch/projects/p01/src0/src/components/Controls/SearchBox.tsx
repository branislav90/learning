// src/components/Controls/SearchBox.tsx
import { useId, type KeyboardEvent } from "react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  const inputId = useId();

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") onChange("");
  }

  return (
    <div className="searchbox">
      <label htmlFor={inputId}>Search title or author</label>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
    </div>
  );
}
