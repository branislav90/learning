import { useReducer, useRef } from 'react';

interface SignupValues {
  email: string;
  password: string;
  plan: 'free' | 'pro';
}

type Errors = Partial<Record<keyof SignupValues, string>>;

function validate(v: SignupValues): Errors {
  const e: Errors = {};
  if (!v.email) e.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Enter a valid email';
  if (v.password.length < 8) e.password = 'At least 8 characters';
  return e;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'succeeded' }
  | { kind: 'failed'; message: string; fieldErrors: Errors };

interface FormState {
  values: SignupValues;
  touched: Partial<Record<keyof SignupValues, boolean>>;
  submitCount: number;
  status: Status;
}

type Action =
  | { type: 'change'; field: keyof SignupValues; value: string }
  | { type: 'blur'; field: keyof SignupValues }
  | { type: 'submitAttempt' }
  | { type: 'submitStart' }
  | { type: 'submitSuccess' }
  | { type: 'submitFailure'; message: string; fieldErrors: Errors };

const initial: FormState = {
  values: { email: '', password: '', plan: 'free' },
  touched: {},
  submitCount: 0,
  status: { kind: 'idle' },
};

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'change': {
      // clear stale server error for this field when the user edits it
      let status: Status = state.status;
      if (status.kind === 'failed') {
        // omit the key (do not set it to undefined: `{...a, ...{k: undefined}}` overrides a.k)
        const { [action.field]: _removed, ...rest } = status.fieldErrors;
        status = { ...status, fieldErrors: rest };
      }
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        status,
      };
    }
    case 'blur':
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    case 'submitAttempt':
      return { ...state, submitCount: state.submitCount + 1 };
    case 'submitStart':
      return { ...state, status: { kind: 'submitting' } };
    case 'submitSuccess':
      return { ...state, status: { kind: 'succeeded' } };
    case 'submitFailure':
      return {
        ...state,
        status: { kind: 'failed', message: action.message, fieldErrors: action.fieldErrors },
      };
  }
}
