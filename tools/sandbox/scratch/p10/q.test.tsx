// @vitest-environment jsdom
import React from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { test } from "vitest";
test("q", () => {
  const qc = new QueryClient();
  function C(){ const q = useQuery({ queryKey:["a"], queryFn: async()=>1, enabled:false }); return <i>{`${q.isLoading}|${q.isPending}|${q.isFetching}`}</i>; }
  const r = render(<QueryClientProvider client={qc}><C/></QueryClientProvider>);
  console.log("Q", r.container.textContent);
});
