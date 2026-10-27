import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: { index: resolve(__dirname, 'src/index.ts'), 'primitives/tabs': resolve(__dirname, 'src/primitives/tabs/index.ts') }, formats: ['es'] },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
    cssCodeSplit: true,
  },
})
