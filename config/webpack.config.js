const mainConfig = require("./webpack.main.config");
const rendererConfig = require("./webpack.renderer.config");

const configs = [mainConfig, rendererConfig];

module.exports = configs;