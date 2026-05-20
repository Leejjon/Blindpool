import * as path from 'path';
import nodeExternals from 'webpack-node-externals';
import CopyPlugin from 'copy-webpack-plugin';

module.exports = {
    entry: './src/index.ts',
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
    plugins: [new CopyPlugin({ patterns: [{ from: '../blindpool-client/build/client', to: 'build'}]})],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
};
