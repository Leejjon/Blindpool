import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { preserveSymlinks: true, tsconfigPaths: true },
  plugins: [reactRouter()],
  ssr: {
    noExternal: ['@mui/*',],
  },
  optimizeDeps: {
    include: ['@mui/*'],
  },
});
