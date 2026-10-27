type CellProps = {
  leading?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
};

export function Cell({ leading, trailing, children }: CellProps) {
  return (
    <td className="cell">
      {leading != null && <span className="cell__leading" aria-hidden="true">{leading}</span>}
      <span className="cell__label">{children}</span>
      {trailing != null && <span className="cell__trailing">{trailing}</span>}
    </td>
  );
}
export {};
