const webpack = require("webpack");
const path2 = require("path");
const nodeExternals = require("webpack-node-externals");
const copyFiles = require('copy-webpack-plugin');

module.exports = {
    entry: ["webpack/hot/poll?100", './index.ts'],
    target: "node",
    mode: "development",
    externals: [
        nodeExternals({
            allowlist: ["webpack/hot/poll?100"]
        })
    ],
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            // all files with a `.ts` extension will be handled by `ts-loader`
            { test: /index.ts$/, loader: 'ts-loader', exclude: /node_modules/}
        ]
    },
    plugins: [new webpack.HotModuleReplacementPlugin(), new copyFiles({ patterns: [{ from: '../blindpool-client/build', to: 'build'}]})],
    output: {
        path: path2.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
};
