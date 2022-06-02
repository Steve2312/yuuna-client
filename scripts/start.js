const concurrently = require("concurrently");

const DEV_SERVER = "http://" + process.env.DEV_HOST + ":" + process.env.DEV_PORT;

concurrently(
    [
        "npm run serve",
        "wait-on " + DEV_SERVER + " && electron ."
    ], {
        killOthers: ["failure", "success"]
    }
);
