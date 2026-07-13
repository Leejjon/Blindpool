import * as path from 'path';
import nodeExternals from 'webpack-node-externals';

module.exports = {
    entry: './src/index.ts',
    target: "node",
    mode: "production",
    externals: [
        nodeExternals({
            modulesDir: path.resolve(__dirname, "node_modules"),
            allowlist: [/^blindpool-common/]
        }),
        nodeExternals({
            modulesDir: path.resolve(__dirname, "../node_modules"),
            allowlist: [/^blindpool-common/]
        })
    ],
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            // all files with a `.ts` extension will be handled by `ts-loader`
            { test: /\.ts$/, loader: 'ts-loader'}
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
};
