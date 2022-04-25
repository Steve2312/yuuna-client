const path = require("path");
const { merge } = require('webpack-merge');

const base = require("./webpack.base.config");
const buildPath = path.resolve(__dirname, "../dist");

module.exports = (env) => {
    return merge(base, {
        entry: "./src/main/index.ts",
        mode: env.NODE_ENV,
        output: {
            filename: "main.bundle.js",
            path: buildPath
        },
        node: {
            __dirname: false,
            __filename: false
        },
        target: "electron-main"
    })
};