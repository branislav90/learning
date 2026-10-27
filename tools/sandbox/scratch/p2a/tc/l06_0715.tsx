import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

function Item({ label }: { label: string }) {
  const [v, setV] = useState("");
  return <input aria-label={label} value={v} onChange={(e) => setV(e.target.value)} />;
}
function List({ keyed }: { keyed: boolean }) {
  const [ids, setIds] = useState(["a", "b"]);
  return (
    <>
      <button onClick={() => setIds([...ids].reverse())}>reverse</button>
      {ids.map((id, i) => <Item key={keyed ? id : i} label={id} />)}
    </>
  );
}

test("keyed: input value follows the item", async () => {
  const user = userEvent.setup();
  render(<List keyed />);
  await user.type(screen.getByLabelText("a"), "hello");
  await user.click(screen.getByText("reverse"));
  expect(screen.getByLabelText("a")).toHaveValue("hello");
});
test("index: input value stays at the position (bug)", async () => {
  const user = userEvent.setup();
  render(<List keyed={false} />);
  await user.type(screen.getByLabelText("a"), "hello");
  await user.click(screen.getByText("reverse"));
  expect(screen.getByLabelText("a")).toHaveValue("");   // the "hello" is now on the other item
});
export {};
