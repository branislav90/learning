// docs/intake-rubric.ts (documented policy; also used by a triage script)
export interface Proposal {
  distinctConsumers: number;       // teams with a real need today
  hasDesignSpec: boolean;
  composableFromExisting: boolean; // can primitives + a recipe solve it?
  a11yPatternKnown: boolean;       // reference pattern exists (e.g., APG)
  maintenanceOwner: string | null;
}

export function triage(p: Proposal): 'reject' | 'recipe' | 'incubate' | 'defer' {
  if (p.composableFromExisting) return 'recipe';          // document a pattern, add no API
  if (!p.maintenanceOwner) return 'defer';                // no owner, no merge
  if (p.distinctConsumers < 2) return 'defer';            // wait for the second use
  if (!p.hasDesignSpec || !p.a11yPatternKnown) return 'defer';
  return 'incubate';
}
