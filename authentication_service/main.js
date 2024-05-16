const jwt = require("./jwt");
const { error, success, setupApp, tryStartMongoose } = require("./common/util");

const { createHash } = require('crypto');
function sha256(str) {
    return createHash('sha256').update(str).digest('hex');
}

const {User} = require("./common/models");

tryStartMongoose();

setupApp(app => {
    app.post("/login", async (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        let {login} = req.body;
        let user = await User.findOne({login});
        if (!user) {
            next(error("User not found"));
            return;
        }
        if (user.password !== sha256(req.body.password)) {
            next(error("User not found"));
            return;
        }
        success(res, {token: jwt.sign({login})});
    });

    app.post("/register", async (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        let {login, password} = req.body;
        if (!/^[a-zA-Z_][a-zA-Z_0-9]{3,24}$/.test(login)) {
            next(error("Bad login"));
            return;
        }
        if (!password || password.length < 8) {
            next(error("Bad password"));
            return;
        }
        if (await User.findOne({login})) {
            next(error("Login already exists"));
            return;
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
            next(error("Invalid token"));
            return;
        }
        let {login} = data;
        if (!await User.findOne({login})) {
            next(error("Invalid token"));
            return;
        }
        success(res, {login});
    });
});

