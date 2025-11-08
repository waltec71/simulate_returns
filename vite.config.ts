import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node', // Default to node for unit tests (no DOM needed)
    setupFiles: './tests/setup.ts',
    environmentMatchGlobs: [
      // Use jsdom for integration tests that need DOM
      ['tests/integration/**', 'jsdom'],
    ],
  },
})

