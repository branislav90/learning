// src/test/App.test.tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../App";

describe("Reading List Explorer", () => {
  it("filters the list as the user types and clears on Escape", async () => {
    const user = userEvent.setup();
    render(<App />);

    const search = screen.getByRole("searchbox", { name: /search title or author/i });
    await user.type(search, "dune");

    const list = screen.getByRole("list", { name: /books/i });
    expect(within(list).getAllByRole("listitem")).toHaveLength(1);

    await user.keyboard("{Escape}");
    expect(search).toHaveValue("");
    expect(within(list).getAllByRole("listitem").length).toBeGreaterThan(1);
  });

  it("shows validation errors only after interaction and adds a valid book", async () => {
    const user = userEvent.setup();
    render(<App />);

    const form = screen.getByRole("form", { name: /add a book/i });
    expect(within(form).queryByRole("alert")).not.toBeInTheDocument();

    await user.click(within(form).getByRole("button", { name: /add book/i }));
    expect(within(form).getAllByRole("alert")).toHaveLength(2);

    await user.type(within(form).getByLabelText(/title/i), "Piranesi");
    await user.type(within(form).getByLabelText(/author/i), "Susanna Clarke");
    await user.click(within(form).getByRole("button", { name: /add book/i }));

    expect(screen.getByRole("heading", { name: "Piranesi" })).toBeInTheDocument();
    expect(within(form).getByLabelText(/title/i)).toHaveValue("");
    expect(within(form).getByLabelText(/title/i)).toHaveFocus();
  });

  it("keeps expanded state attached to the correct book after removing another", async () => {
    const user = userEvent.setup();
    render(<App />);

    const items = screen.getAllByRole("listitem");
    const secondTitle = within(items[1]!).getByRole("heading").textContent ?? "";
    await user.click(within(items[1]!).getByRole("button", { name: /show notes/i }));
    await user.click(within(items[0]!).getByRole("button", { name: /remove/i }));

    const survivor = screen.getByRole("heading", { name: secondTitle }).closest("li")!;
    expect(within(survivor).getByRole("button", { name: /hide notes/i })).toBeInTheDocument();
  });
});
