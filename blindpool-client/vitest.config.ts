import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import {resolve} from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['**/*.test.tsx', '**/*.test.ts'],
    globals: true,
    setupFiles: 'app/setupTests.ts',
    environment: "jsdom",
    testTimeout: 100000
  },
  resolve: {
    alias: [{ find: "~", replacement: resolve(__dirname, "./app") }]
  }
});
