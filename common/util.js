const fs = require("fs");
const mongoose = require("mongoose");

exports.getEnv = function(name) {
    return process.env[name] || fs.readFileSync(process.env[name + "_FILE"], "utf8")
}

const MONGO_URL = exports.getEnv("MONGO_URL");

exports.tryStartMongoose = function() {
    mongoose.connect(MONGO_URL).then(() => {
        console.info("Connected to MongoDB");
    }).catch(e => {
        console.error(e);
        console.warn("Couldn't connect to MongoDB, retrying in 10 seconds");
        setTimeout(exports.tryStartMongoose, 10000);
    });
}

exports.error = function(message) {
    return new APIError(message);
}
exports.success = function(res, data = {}) {
    res.status(200).json(Object.assign({success: true}, data));
}

class APIError extends Error {
    constructor(message) {
        super(message);
    }
}

exports.errorHandler = function(err, req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    console.error(err);
    let ans = {success: false};
    if (err instanceof APIError) {
        ans.message = err.message;
    }
    res.status(400).json(ans);
}

/**
 * @param {(Express) => void} func
 * */
exports.setupApp = function(func) {
    const app = require("express")();
    const bodyParser = require("body-parser");

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    func(app);

    app.use(exports.errorHandler);

    app.listen(parseInt(process.env["PORT"] || 8080));

    process.on('SIGTERM', process.exit);
    process.on('SIGINT', process.exit);
}
