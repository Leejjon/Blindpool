import {type RouteConfig, index, route, layout} from "@react-router/dev/routes";

export default [
    layout("./routes/layout.tsx", [
        index("./routes/index.tsx"),
        route("/about", "./routes/about.tsx"),
        route("/create", "./routes/create.tsx"),
        route("/howto", "./routes/howto.tsx"),
        route("/pool/:key", "./routes/pool.tsx"),
    ])
] satisfies RouteConfig;
