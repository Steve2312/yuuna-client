const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const base = require("./webpack.base.config");
const process = require("process");
const buildPath = path.resolve(__dirname, "../dist");

module.exports = merge(base, {
    entry: "./src/renderer/main.tsx",
    target: "electron-renderer",
    output: {
        filename: "renderer.bundle.js",
        path: buildPath
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/renderer/index.html"
        })
    ],
    devServer: {
        host: process.env.DEV_HOST,
        port: process.env.DEV_PORT
    }
});
