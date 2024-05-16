const jwt = require("jsonwebtoken");
const { getEnv } = require("./common/util");
let key = getEnv("JWT_KEY");

exports.verify = function (token) {
    try {
        return jwt.verify(token, key);
    } catch (e) {
        console.error(e);
        return false;
    }
};
exports.sign = function (payload) {
    return jwt.sign(
        Object.assign({exp: Math.floor(new Date().getTime() / 1000) + 3 * 24 * 60 * 60}, payload),
        key
    )
};
