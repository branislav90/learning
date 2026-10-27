// scripts/check-lib.ts
import ts from 'typescript';
const cfgPath = ts.findConfigFile('.', ts.sys.fileExists, 'tsconfig.json')!;
const cfg = ts.getParsedCommandLineOfConfigFile(cfgPath, {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: (d) => { throw new Error(String(d.messageText)); } })!;
const program = ts.createProgram(cfg.fileNames, cfg.options);
const diagnostics = ts.getPreEmitDiagnostics(program).filter((d) => d.code === 2550 || d.code === 2339 /* property does not exist */);
diagnostics.forEach((d) => console.error(ts.flattenDiagnosticMessageText(d.messageText, '\n')));
process.exit(diagnostics.length ? 1 : 0);
