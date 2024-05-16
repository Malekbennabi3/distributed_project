const jwt = require("jsonwebtoken")
const fs = require("fs");
let privateKey;
let publicKey;

exports.verify = function (token) {
    if (!publicKey) {
        publicKey = fs.readFileSync(process.env["PUBLIC_KEY_PATH"]);
    }
    try {
        return jwt.verify(token, publicKey);
    } catch (e) {
        return false;
    }
};
exports.sign = function (payload) {
    if (!privateKey) {
        privateKey = fs.readFileSync(process.env["PRIVATE_KEY_PATH"]);
    }
    return jwt.sign(
        Object.assign({exp: Math.floor(new Date().getTime() / 1000) + 3 * 24 * 60 * 60}, payload),
        privateKey,
        { algorithm: "RS256" }
    )
};
