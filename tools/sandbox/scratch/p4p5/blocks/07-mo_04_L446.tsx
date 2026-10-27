// src/app/main.tsx (composition root, excerpt)
import { composeModules } from "@/platform/module-system";
import { ordersModule } from "@/modules/orders";
import { returnsModule } from "@/modules/returns";

export const app = composeModules([ordersModule, returnsModule]);
export {};
