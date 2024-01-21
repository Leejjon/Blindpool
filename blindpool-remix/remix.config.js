/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*", "*.css"],
  serverDependenciesToBundle: ["@mui/icons-material/ArrowDropDown", "@mui/icons-material/Menu", "@mui/material/styles/createTheme", "remix-i18next"]
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
