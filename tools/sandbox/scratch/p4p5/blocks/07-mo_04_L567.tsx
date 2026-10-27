// packages/orders/src/contract.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { OrderRow } from "./index";
import { createFakeOrdersEnv, OrdersTestProvider } from "./testing";

describe("orders contract", () => {
  it("OrderRow reports order.opened through the injected env", async () => {
    const { env, events } = createFakeOrdersEnv();
    render(
      <OrdersTestProvider env={env}>
        <OrderRow order={{ id: "o1", total: { amountMinor: 1250, currency: "EUR" }, status: "paid" }} />
      </OrdersTestProvider>,
    );
    await userEvent.click(screen.getByRole("listitem"));
    expect(events).toEqual([{ type: "order.opened", orderId: "o1" }]);
  });

  it("index.ts exports exactly the documented surface", async () => {
    const mod = await import("./index");
    expect(Object.keys(mod).sort()).toEqual(["OrderList", "OrderRow", "OrdersEnvProvider", "useOrder"].sort());
  });
});
export {};
