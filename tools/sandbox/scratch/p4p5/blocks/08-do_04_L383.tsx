// contexts/disputes/application/use-disputable-transaction.ts
import { useQuery } from "@tanstack/react-query";
import { toDisputable } from "../infrastructure/monitoring-acl";
import { disputesGateway } from "../infrastructure/disputes-gateway";
import { disputability } from "../domain/disputable-transaction";

export function useDisputableTransaction(id: string) {
  const query = useQuery({
    queryKey: ["disputes", "disputable-transaction", id],
    queryFn: async () => toDisputable(await disputesGateway.fetchMonitoringTx(id)),
  });
  const verdict = query.data
    ? disputability(query.data, /* alreadyDisputed */ false, new Date())
    : undefined;
  return { ...query, verdict };
}
export {};
