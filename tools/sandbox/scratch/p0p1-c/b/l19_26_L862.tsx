export {};
interface Column<Row> {
  header: string;
  cell: (row: Row) => React.ReactNode;
  sortKey?: keyof Row;
}
interface DataTableProps<Row> {
  columns: readonly Column<Row>[];
  rows: readonly Row[];
  getRowId: (row: Row) => string | number;
}
export function DataTable<Row>({ columns, rows, getRowId }: DataTableProps<Row>) {
  return (
    <table>
      <thead><tr>{columns.map((c) => <th key={c.header} scope="col">{c.header}</th>)}</tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={getRowId(r)}>{columns.map((c) => <td key={c.header}>{c.cell(r)}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}
