const webpack = require("webpack");
const pathDev = require("path");
const nodeExternalsDev = require("webpack-node-externals");
const copyFiles = require('copy-webpack-plugin');

module.exports = {
    entry: ["webpack/hot/poll?100", "./src/app.js"],
    target: "node",
    externals: [
        nodeExternalsDev({
            allowlist: ["webpack/hot/poll?100"]
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
    plugins: [new webpack.HotModuleReplacementPlugin(), new copyFiles({ patterns: [{ from: 'local.key'}]})],
    output: {
        path: pathDev.join(__dirname, "dist"),
        filename: "index.js"
    }
};
