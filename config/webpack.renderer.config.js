const path = require("path");
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const base = require("./webpack.base.config");
const buildPath = path.resolve(__dirname, "../dist");

module.exports = (env) => {
    return merge(base, {
        entry: "./src/renderer/main.tsx",
        mode: env.NODE_ENV,
        output: {
            filename: "renderer.bundle.js",
            path: buildPath
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/renderer/index.html"
            })
        ],
        target: "electron-renderer"
    })
};