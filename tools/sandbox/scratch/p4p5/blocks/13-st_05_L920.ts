type Wizard =
  | { step: 'account'; account: { email: string } }
  | { step: 'profile'; account: { email: string }; profile: { name: string } }
  | { step: 'review'; account: { email: string }; profile: { name: string } }
  | { step: 'submitted' };
type WizardEvent =
  | { type: 'NEXT'; patch?: Partial<{ email: string; name: string }> }
  | { type: 'BACK' } | { type: 'SUBMIT' };
export {};
