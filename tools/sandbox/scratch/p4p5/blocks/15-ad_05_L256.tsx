import { VendorPicker } from 'vendor-datepicker';

export interface DateFieldProps {
  value: Date | null;
  onChange: (next: Date | null) => void;
  min?: Date;
  locale?: string;       // BCP-47, e.g. 'en-GB'
  label: string;
}

const toIsoDay = (d: Date) => d.toISOString().slice(0, 10);
const fromIsoDay = (s: string) => new Date(`${s}T00:00:00`);

export function DateField({ value, onChange, min, locale = 'en-GB', label }: DateFieldProps) {
  return (
    <label>
      <span>{label}</span>
      <VendorPicker
        selected={value ? toIsoDay(value) : undefined}
        onSelect={(iso) => onChange(iso ? fromIsoDay(iso) : null)}
        minDate={min ? toIsoDay(min) : undefined}
        locale_id={locale.replace('-', '_')}
      />
    </label>
  );
}
export {};
