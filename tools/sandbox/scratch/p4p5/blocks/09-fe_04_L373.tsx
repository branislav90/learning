// features/dispute-transaction/ui/DisputeDialog.tsx  (violations)
import { useCurrentDriver } from "@/features/driver-profile/model/store";  // ✗ sibling slice + deep import
import { TransactionsTable } from "@/widgets/transactions-table";            // ✗ upward import
import { cn } from "../../../../shared/lib/cn";                              // ✗ fragile relative path to shared (style issue; prefer alias)
export {};
