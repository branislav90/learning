switch (action.type) {
  case 'SUBMIT': return { ...state, isLoading: true };   // valid in every state?
  ...
}
export {};
