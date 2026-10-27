export {};
   interface CurrencyInputProps {
     value: number | null;              // minor units (cents)
     onValueChange: (next: number | null) => void;
     currency: 'EUR' | 'USD' | 'GBP';
     locale?: string;
     // ...TextField label/description/error props via composition
   }
   