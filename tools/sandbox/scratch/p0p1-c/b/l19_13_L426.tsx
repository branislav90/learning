export {};
type AlertProps =
  | { variant: "info"; message: string }
  | { variant: "error"; message: string; onRetry: () => void }
  | { variant: "confirm"; message: string; onConfirm: () => void; onCancel: () => void };

export function Alert(props: AlertProps) {
  switch (props.variant) {
    case "info":
      return <p role="status">{props.message}</p>;
    case "error":
      return (
        <div role="alert">
          {props.message} <button onClick={props.onRetry}>Retry</button>
        </div>
      );
    case "confirm":
      return (
        <div role="alertdialog" aria-label={props.message}>
          {props.message}
          <button onClick={props.onConfirm}>OK</button>
          <button onClick={props.onCancel}>Cancel</button>
        </div>
      );
    default: {
      const _never: never = props;
      return _never;
    }
  }
}
// <Alert variant="error" message="Oops" />               → error: onRetry is missing
// <Alert variant="info" message="Hi" onRetry={retry} />   → error: onRetry does not exist on the info variant
