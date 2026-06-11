import * as webpack from 'webpack';
import * as path from 'path';
import nodeExternals from 'webpack-node-externals';

module.exports = {
    entry: ["webpack/hot/poll?100", "./src/index.ts"],
    watch: true,
    target: "node",
    externals: [
        nodeExternals({
            modulesDir: path.resolve(__dirname, "node_modules"),
            allowlist: ["webpack/hot/poll?100"]
        }),
        nodeExternals({
            modulesDir: path.resolve(__dirname, "../node_modules"),
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
    plugins: [new webpack.HotModuleReplacementPlugin()],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "index.js"
    }
};
