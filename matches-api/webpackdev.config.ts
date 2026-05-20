import * as webpack from 'webpack';
import * as path from 'path';
import nodeExternals from 'webpack-node-externals';
import CopyPlugin from 'copy-webpack-plugin';

module.exports = {
    entry: ["webpack/hot/poll?100", "./src/index.ts"],
    target: "node",
    externals: [
        nodeExternals({
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
    plugins: [new webpack.HotModuleReplacementPlugin(), new CopyPlugin({ patterns: [{ from: 'local.key'}]})],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "index.js"
    }
};
