"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = __importDefault(require("../utils/environment"));
function auth(req, res, next) {
    // recovery of the token in header without the bearer
    const token = req.cookies.access_token;
    // verification of the existence of the token
    if (!token) {
        res.status(403).json({
            message: 'token manquant',
        });
    }
    else {
        // verification of the validity of the token thanks to the public key
        jsonwebtoken_1.default.verify(token, environment_1.default.KEY_TOKEN, (err, data) => {
            if (err) {
                res
                    .clearCookie('access_token')
                    .status(403).json({
                    message: `Desole, une erreur est survenu: ${err}`,
                });
            }
            else {
                next();
            }
        });
    }
}
exports.auth = auth;
//# sourceMappingURL=authentificator.js.map