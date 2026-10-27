// src/ui/fields/fieldId.ts
export const fieldId = (path: string) => `f-${path.replace(/[^A-Za-z0-9_-]/g, "-")}`;
