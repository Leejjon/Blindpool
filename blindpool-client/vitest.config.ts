import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['**/*.test.tsx', '**/*.test.ts'],
    globals: true,
    setupFiles: 'src/setupTests.ts',
    environment: "jsdom"
  },
});