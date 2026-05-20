import * as webpack from 'webpack';
import * as path from 'path';
import nodeExternals from 'webpack-node-externals';
import CopyPlugin from 'copy-webpack-plugin';

module.exports = {
    entry: ["webpack/hot/poll?100", './src/index.ts'],
    target: "node",
    mode: "development",
    externals: [
        nodeExternals({
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
    plugins: [new webpack.HotModuleReplacementPlugin(), new CopyPlugin({ patterns: [{ from: '../blindpool-client/build/client', to: 'build'}]})],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
};
