const mainConfig = require("./webpack.main.config");
const rendererConfig = require("./webpack.renderer.config");

module.exports = (env) => {
    return [mainConfig(env), rendererConfig(env)]
};