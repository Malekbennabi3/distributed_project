const app = require("express")();
const bodyParser = require("body-parser");
const jwt = require("./jwt");
const { getEnv } = require("./common/util");

const { createHash } = require('crypto');
function sha256(str) {
    return createHash('sha256').update(str).digest('hex');
}

const mongoose = require("mongoose");
const User = require("./user").model;
const MONGO_URL = getEnv("MONGO_URL");
function tryStartMongoose() {
    mongoose.connect(MONGO_URL).then(() => {
        console.info("Connected to MongoDB");
    }).catch(e => {
        console.error(e);
        console.warn("Couldn't connect to MongoDB, retrying in 10 seconds");
        setTimeout(tryStartMongoose, 10000);
    });
}
tryStartMongoose();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function error(message) {
    return new APIError(message);
}
function success(res, data = {}) {
    res.status(200).json(Object.assign({success: true}, data));
}

class APIError extends Error {
    constructor(message) {
        super(message);
    }
}

app.post("/login", async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    let {login} = req.body;
    let user = await User.findOne({login});
    if (!user) {
        next(error("User not found")); return;
    }
    if (user.password !== sha256(req.body.password)) {
        next(error("User not found")); return;
    }
    success(res, {token: jwt.sign({login})});
});

app.post("/register", async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    let {login, password} = req.body;
    if (!/^[a-zA-Z_][a-zA-Z_0-9]{3,24}$/.test(login)) {
        next(error("Bad login")); return;
    }
    if (!password || password.length < 8) {
        next(error("Bad password")); return;
    }
    if (await User.findOne({login})) {
        next(error("Login already exists")); return;
    }
    let user = new User({
        login, password: sha256(password)
    });
    await user.save();
    success(res);
});

app.post("/info", async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    let {token} = req.body;
    let data = jwt.verify(token);
    if (!data) {
        next(error("Invalid token")); return;
    }
    let {login} = data;
    if (!await User.findOne({login})) {
        next(error("Invalid token")); return;
    }
    success(res, {login});
});

app.use((err, req, res, next) => {
    console.error(err);
    let ans = {success: false};
    if (err instanceof APIError) {
        ans.message = err.message;
    }
    res.status(400).json(ans);
});

app.listen(parseInt(process.env["PORT"] || 8080));

process.on('SIGTERM', process.exit);
process.on('SIGINT', process.exit);
