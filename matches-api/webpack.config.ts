import * as path from 'path';
import nodeExternals from 'webpack-node-externals';

module.exports = {
    entry: ['./src/index.ts'],
    resolve: {
        extensions: ['.ts']
    },
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
        }),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            // all files with a `.ts` extension will be handled by `ts-loader`
            {test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/}
        ]
    }
};
