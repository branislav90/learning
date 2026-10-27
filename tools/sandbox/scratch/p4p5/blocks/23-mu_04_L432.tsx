import { useFlag } from "@acme/feature-flags";

export function LimitEditorEntry() {
  const enabled = useFlag("cards.new-limit-editor");
  return enabled ? <NewLimitEditor /> : <LegacyLimitEditor />;
}
export {};
