// src/shared/config/schema.ts
import { z } from "zod";

export const ConfigSchema = z.object({
  env: z.enum(["development", "staging", "production"]),
  apiBaseUrl: z.string().url(),
  authIssuerUrl: z.string().url(),
  monitoring: z
    .object({
      dsn: z.string().url().optional(),   // public DSN-style identifier, if used
      sampleRate: z.number().min(0).max(1).default(0.1),
    })
    .default({ sampleRate: 0.1 }),
  features: z.record(z.string(), z.boolean()).default({}), // static defaults; flags may override
});

export type AppConfig = Readonly<z.infer<typeof ConfigSchema>>;
