/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: ['e2e/', "node_modules/", "dist/", "**/*.d.ts", "src/types.tsx"],
    coverage: {
      provider: 'v8', // o 'istanbul'
      reporter: ['text', 'json', 'html'],
      include: ['src/'],
      exclude: ['e2e/', "node_modules/", "dist/", "**/*.d.ts", "src/types.tsx"],
    },
  },
});