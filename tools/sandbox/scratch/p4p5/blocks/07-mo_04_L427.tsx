// src/modules/returns/index.ts
import { OrderActions } from "@/modules/orders";           // returns → orders (declared edge)
import type { AppModule } from "@/platform/module-system";
import { StartReturnButton } from "./ui/StartReturnButton";

export const returnsModule: AppModule = {
  id: "returns",
  routes: [{ path: "/returns/*", load: () => import("./routes") }],
  register: ({ extensions }) =>
    extensions.contribute(OrderActions, {
      id: "start-return",
      render: (orderId) => <StartReturnButton orderId={orderId} />,
    }),
};
export {};
