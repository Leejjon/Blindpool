import {type RouteConfig, index, route, layout} from "@react-router/dev/routes";

export default [
    layout("./routes/_layout.tsx", [
        index("./routes/_layout._index.tsx"),
        route("/about", "./routes/_layout.about.tsx"),
        route("/create", "./routes/_layout.create.tsx"),
        route("/howto", "./routes/_layout.howto.tsx"),
        route("/pool/:key", "./routes/_layout.pool.$key.tsx"),
    ])
] satisfies RouteConfig;
