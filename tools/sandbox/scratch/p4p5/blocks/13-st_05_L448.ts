type EditorState =
  | { mode: 'viewing' }
  | { mode: 'editing'; draft: string; sub: 'pristine' | 'dirty' | { kind: 'saving'; requestId: number } };

function editorReducer(state: EditorState, event: EditorEvent): EditorState {
  // Parent-level handling: CANCEL works in every `editing` sub-state.
  if (state.mode === 'editing' && event.type === 'CANCEL') return { mode: 'viewing' };
  // ...dispatch to child handling by state.mode/state.sub
  return state;
}
type EditorEvent = { type: 'EDIT' } | { type: 'TYPE'; text: string } | { type: 'SAVE' } | { type: 'CANCEL' };
export {};
