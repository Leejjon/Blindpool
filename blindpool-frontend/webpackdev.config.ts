const webpack = require("webpack");
const pathDev = require("path");
const nodeExternalsDev = require("webpack-node-externals");
const copyFilesDev = require('copy-webpack-plugin');

module.exports = {
    entry: ["webpack/hot/poll?100", './src/index.ts'],
    target: "node",
    mode: "development",
    externals: [
        nodeExternalsDev({
            allowlist: ["webpack/hot/poll?100"]
        })
    ],
    resolve: {
        extensions: ['.ts', ".js"]
    },
    module: {
        rules: [
            // all files with a `.ts` extension will be handled by `ts-loader`
            { test: /\.ts?$/, loader: 'ts-loader', exclude: /node_modules/}
        ]
    },
    plugins: [new webpack.HotModuleReplacementPlugin(), new copyFilesDev({ patterns: [{ from: '../blindpool-client/build/client', to: 'build'}]})],
    output: {
        path: pathDev.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
};
