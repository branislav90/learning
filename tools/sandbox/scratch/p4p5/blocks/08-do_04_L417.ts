// src/types/driver.ts   ← imported by 70 files across contexts
export interface Driver {
  id: string;
  name: string;
  licenceClass?: string;
  cardNumber?: string;
  cardLimit?: number;
  restPeriods?: RestPeriod[];
  tachographId?: string;
  // … 40 more optional fields
}
export {};
