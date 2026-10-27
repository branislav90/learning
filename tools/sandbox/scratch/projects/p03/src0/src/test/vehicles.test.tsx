// src/test/vehicles.test.tsx
import { expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "./renderRoute";

it("restores filters from the URL and normalizes hostile params", async () => {
  renderRoute("/vehicles?status=banana&page=-5&sort=__proto__");
  expect(await screen.findByRole("heading", { name: "Vehicles" })).toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: /status/i })).toHaveValue("all");
});

it("filters via the URL and keeps Back working", async () => {
  const user = userEvent.setup();
  const { router } = renderRoute("/vehicles");
  await screen.findByRole("table");
  await user.selectOptions(screen.getByRole("combobox", { name: /status/i }), "active");
  expect(router.state.location.search).toBe("?status=active");
  await router.navigate(-1);
  expect(router.state.location.search).toBe("");
});

it("shows a route-level 404 for an unknown vehicle but keeps the shell", async () => {
  renderRoute("/vehicles/does-not-exist");
  expect(await screen.findByRole("heading", { name: /not found/i })).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: /main/i })).toBeInTheDocument(); // shell survived
});

it("shows a retryable error for server failures", async () => {
  renderRoute("/vehicles", { latencyMs: 0, failure: () => 503 });
  expect(await screen.findByRole("button", { name: /try again/i })).toBeInTheDocument();
});
