// vendor-datepicker (hypothetical)
export interface VendorPickerProps {
  selected: string | undefined;           // 'YYYY-MM-DD'
  onSelect: (iso: string | undefined) => void;
  minDate?: string;
  locale_id?: string;
  className?: string;
}
export declare function VendorPicker(props: VendorPickerProps): React.JSX.Element;
export {};
