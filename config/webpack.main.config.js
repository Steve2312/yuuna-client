const path = require("path");
const { merge } = require("webpack-merge");

const base = require("./webpack.base.config");
const buildPath = path.resolve(__dirname, "../dist");

module.exports = merge(base, {
    entry: "./src/main/index.ts",
    target: "electron-main",
    output: {
        filename: "main.bundle.js",
        path: buildPath
    },
    node: {
        __dirname: false,
        __filename: false
    }
});