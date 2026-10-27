type TableProps = {
  rows: Row[];
  columns: ColumnDef[];
  showHeader?: boolean;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  onRowClick?: (row: Row) => void;
  renderEmpty?: () => ReactNode;
  headerClassName?: string;
  rowClassName?: (row: Row) => string;
  fetchUrl?: string;                 // fetches its own data
  analyticsEvent?: string;           // calls a global tracker
  locale?: 'en' | 'de' | 'fr';       // ships its own strings
};
export {};
