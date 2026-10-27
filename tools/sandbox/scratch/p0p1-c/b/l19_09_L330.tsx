export {};
// ❌
function Button(props: any) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
<Button onclick={handleClick}>Save</Button>;     // typo accepted silently
