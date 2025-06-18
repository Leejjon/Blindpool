import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  resolve: { preserveSymlinks: true },
  plugins: [reactRouter(), tsconfigPaths()],
  ssr: {
    noExternal: ['@mui/*',],
  },
  optimizeDeps: {
    include: ['@mui/*'],
  },
});
