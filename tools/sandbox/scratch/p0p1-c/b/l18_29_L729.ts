export {};
type Step1 = { step: 1; email: string };
type Step2 = { step: 2; email: string; address: Address };
type Step3 = { step: 3; email: string; address: Address; payment: Payment };
type Wizard = Step1 | Step2 | Step3;

function next(w: Wizard, input: unknown): Wizard { /* switch on w.step; each case accepts only its input type */ }
type Submittable = Extract<Wizard, { step: 3 }>;
