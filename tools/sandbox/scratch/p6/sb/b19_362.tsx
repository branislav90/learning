declare const createReport: any; type createReport<T=any,U=any,V=any> = any;
declare const Draft: any; type Draft<T=any,U=any,V=any> = any;
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useReducer } from 'react';

type Wizard =
  | { step: 'details'; draft: Draft }
  | { step: 'review'; draft: Draft }
  | { step: 'saving'; draft: Draft }
  | { step: 'failed'; draft: Draft; message: string }
  | { step: 'done'; id: string };

type Event =
  | { type: 'NEXT' } | { type: 'BACK' } | { type: 'EDIT'; patch: Partial<Draft> }
  | { type: 'SAVE' } | { type: 'SAVED'; id: string } | { type: 'FAILED'; message: string } | { type: 'RETRY' };

function reducer(s: Wizard, e: Event): Wizard {
  switch (s.step) {
    case 'details': return e.type === 'EDIT' ? { ...s, draft: { ...s.draft, ...e.patch } }
                         : e.type === 'NEXT' ? { step: 'review', draft: s.draft } : s;
    case 'review':  return e.type === 'BACK' ? { step: 'details', draft: s.draft }
                         : e.type === 'SAVE' ? { step: 'saving', draft: s.draft } : s;
    case 'saving':  return e.type === 'SAVED' ? { step: 'done', id: e.id }
                         : e.type === 'FAILED' ? { step: 'failed', draft: s.draft, message: e.message } : s;
    case 'failed':  return e.type === 'RETRY' ? { step: 'saving', draft: s.draft }
                         : e.type === 'BACK' ? { step: 'review', draft: s.draft } : s;
    case 'done':    return s;
  }
}

export function useReportWizard(initial: Draft) {
  const qc = useQueryClient();
  const [state, dispatch] = useReducer(reducer, { step: 'details', draft: initial } as Wizard);
  const save = useMutation({
    mutationFn: (d: Draft) => createReport(d),
    onSuccess: (r) => { dispatch({ type: 'SAVED', id: r.id }); void qc.invalidateQueries({ queryKey: ['reports'] }); },
    onError: (e) => dispatch({ type: 'FAILED', message: e instanceof Error ? e.message : 'Unknown error' }),
  });

  // Side effect is triggered by the *transition*, not by effect-watching state:
  const send = (e: Event) => {
    dispatch(e);
    if (e.type === 'SAVE' || e.type === 'RETRY') save.mutate(state.step === 'review' || state.step === 'failed' ? state.draft : initial);
  };
  return { state, send };
}
export {};
