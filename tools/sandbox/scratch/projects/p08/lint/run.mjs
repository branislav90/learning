import { ESLint } from 'eslint';
const e = new ESLint({ cwd: process.cwd() });
for (const r of await e.lintFiles(['src/**/*.js'])) console.log(r.filePath.replace(process.cwd(), ''), r.messages.map(m => m.ruleId + ': ' + m.message.slice(0, 60)));
