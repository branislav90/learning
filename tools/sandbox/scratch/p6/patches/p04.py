from patchlib import apply
apply('04',[
("### 5.4 Practical: schema-library version (⚠ verify against current docs)","### 5.4 Practical: schema-library version (Zod 4; run against `zod` 4.6)"),
("import { z } from 'zod';   // ⚠ API shown follows Zod's commonly documented style; verify for your major version","import { z } from 'zod';   // Zod 4 API (run against zod 4.6). In Zod 3, use z.string().datetime({ offset: true }) instead of z.iso.datetime()"),
("z.union([z.string().min(1), z.number().int().safe()])","z.union([z.string().min(1), z.number().int()])"),
("created_at: z.string().datetime({ offset: true }).transform","created_at: z.iso.datetime({ offset: true }).transform"),
("(c) default behavior for unknown keys and error formatting differ by library/version — **verify**;","(c) default behavior for unknown keys and error formatting differ by library/version (Zod 4: unknown keys are stripped by default and a `ZodError` exposes `issues[].path`, e.g. `['lines', 0, 'sku']`; both verified by running this schema; `z.string().datetime()` and `.safe()` are deprecated in Zod 4 in favour of `z.iso.datetime()` and `.int()`);"),
("⚠ *the specific APIs differ per library and change between major versions; every library call in this lesson must be verified against its current docs*","*the specific APIs differ per library and change between major versions; the Zod snippet in §5.4 was executed against Zod 4.6, other libraries' calls were not*"),
])
