// features/transactions/model/useTransactionsPage.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../../legacy/store/transactions"; // legacy thunk: unchanged
import { selectedTotal, toggle, visibleTransactions, type SortKey } from "../domain/transactions";
import type { RootState } from "../../../legacy/store";

export function useTransactionsPage(accountId: string) {
  const dispatch = useDispatch<any>(); // legacy thunk typing; narrowed in a later migration step
  const { items, loading, error } = useSelector((s: RootState) => s.tx);
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("date");

  useEffect(() => {
    dispatch(fetchTransactions(accountId));
  }, [dispatch, accountId]);

  const rows = useMemo(() => visibleTransactions(items, sort), [items, sort]);
  const total = useMemo(() => selectedTotal(rows, selected), [rows, selected]);
  const onToggle = useCallback((id: string) => setSelected((s) => toggle(s, id)), []);

  return { rows, total, loading, error, selected, sort, setSort, onToggle };
}
export {};
