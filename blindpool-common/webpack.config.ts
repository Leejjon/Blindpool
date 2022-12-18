const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: './index.ts',
    target: "node",
    mode: "production",
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            // all files with a `.ts` extension will be handled by `ts-loader`
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/}
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
};
