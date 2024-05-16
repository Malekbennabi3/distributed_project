const fs = require("fs");

exports.getEnv = function (name) {
    return process.env[name] || fs.readFileSync(process.env[name + "_FILE"], "utf8")
}
