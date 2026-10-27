// View test — no network, no providers
import { render, screen } from "@testing-library/react";
test("empty state", () => {
  render(<OrdersView state={{ status: "ready", orders: [] }} pendingId={null} onShip={() => {}} />);
  expect(screen.getByText("No orders yet.")).toBeInTheDocument();
});
export {};
