import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
//https://stackoverflow.com/questions/75732001/create-theme-error-in-vite-application-using-the-materialui-library

export default defineConfig({
  plugins: [remix({
    ignoredRouteFiles: ["**/.*", "*.css"],
  }), tsconfigPaths()],
  ssr: {
    noExternal: ["@mui/icons-material/ArrowDropDown", "@mui/icons-material/Menu", "@mui/material/styles"]
  }
});
