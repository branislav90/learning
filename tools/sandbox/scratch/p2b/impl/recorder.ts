// recorder.ts
import type { ProfilerOnRenderCallback } from 'react';

export interface CommitRecord {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
}

export function createRecorder() {
  const commits: CommitRecord[] = [];
  const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration) => {
    commits.push({ id, phase, actualDuration });
  };
  return { onRender, commits, reset: () => { commits.length = 0; } };
}
