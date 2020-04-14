const webpack = require("webpack");
const pathDev = require("path");
const nodeExternalsDev = require("webpack-node-externals");

module.exports = {
    entry: ["webpack/hot/poll?100", "./src/index.ts"],
    watch: true,
    target: "node",
    externals: [
        nodeExternalsDev({
            whitelist: ["webpack/hot/poll?100"]
        })
    ],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    mode: "development",
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    output: {
        path: pathDev.join(__dirname, "dist"),
        filename: "index.js"
    }
};