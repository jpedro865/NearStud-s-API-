"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh_token = exports.valid_email_token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokens_service_1 = require("../services/tokens.service");
const users_services_1 = require("../services/users.services");
const environment_1 = __importDefault(require("../utils/environment"));
const path_1 = require("path");
/**
 * Valide le token d'un utilisateur utilise pour valider son email
 *
 * @param req
 * @param res
 */
function valid_email_token(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // gestion du template html
        const erreur_page = (0, path_1.join)(__dirname, "../../public/html/validation_fail.html");
        const success_page = (0, path_1.join)(__dirname, "../../public/html/validation_success.html");
        // Vérification du token
        const token = req.params.token;
        jsonwebtoken_1.default.verify(token, environment_1.default.KEY_TOKEN, (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.status(403).sendFile(erreur_page);
            }
            else {
                const token = yield (0, tokens_service_1.findByUserId)(data._id);
                if (token && !token.used) {
                    yield (0, tokens_service_1.setUsedToken)(token._id.toString());
                    const verified = yield (0, users_services_1.verifyUser)(token.user_id);
                    if (verified) {
                        res.status(200).sendFile(success_page);
                    }
                    else {
                        res.status(403).sendFile(erreur_page);
                    }
                }
                else {
                    res.status(403).sendFile(erreur_page);
                }
            }
        }));
    });
}
exports.valid_email_token = valid_email_token;
/**
 * Controller pour rafraichir le token
 *
 * @param req
 * @param res
 */
function refresh_token(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Vérification du token
        const token = req.cookies.refresh_token;
        if (token) {
            jsonwebtoken_1.default.verify(token, environment_1.default.KEY_TOKEN_REFRESH, (err, data) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g;
                if (err) {
                    res
                        .clearCookie('access_token')
                        .clearCookie('refresh_token')
                        .status(403).json({
                        message: `Desole, une erreur est survenu: ${err}`,
                    });
                    return;
                }
                else if (yield (0, tokens_service_1.verifyRefreshToken)(data._id, token)) {
                    var user = null;
                    if (yield (0, users_services_1.verifyUser)(data._id)) {
                        user = yield (0, users_services_1.getUserById)(data._id);
                    }
                    if (user) {
                        const access_token = jsonwebtoken_1.default.sign({
                            "_id": (_a = user._id) !== null && _a !== void 0 ? _a : "",
                            "email": (_b = user.email) !== null && _b !== void 0 ? _b : "",
                            "firstname": (_c = user.firstname) !== null && _c !== void 0 ? _c : "",
                            "lastname": (_d = user.lastname) !== null && _d !== void 0 ? _d : "",
                            "username": (_e = user.username) !== null && _e !== void 0 ? _e : "",
                            "age": (_f = user.age) !== null && _f !== void 0 ? _f : 0,
                            "admin": (_g = user.admin) !== null && _g !== void 0 ? _g : 0,
                        }, environment_1.default.KEY_TOKEN, {
                            expiresIn: 3600, // 1 heure
                        });
                        const refresh_token = jsonwebtoken_1.default.sign({
                            "_id": user._id,
                        }, environment_1.default.KEY_TOKEN_REFRESH, {
                            expiresIn: 3600 * 24 * 90, // 90 days
                        });
                        if (yield (0, tokens_service_1.addRefreshToken)(user._id.toString(), refresh_token)) {
                            res
                                .cookie('access_token', access_token, {
                                httpOnly: true,
                                maxAge: 1000 * 3600, // 1 heure
                            })
                                .cookie('refresh_token', refresh_token, {
                                path: '/refresh',
                                httpOnly: true,
                                maxAge: 1000 * 3600 * 24 * 90, // 90 days
                            })
                                .status(200).json({
                                message: "Token rafraichit",
                            });
                            return;
                        }
                        else {
                            res
                                .clearCookie('access_token')
                                .clearCookie('refresh_token')
                                .status(403).json({
                                message: `Desole, une erreur est survenu : refresh token not created`,
                            });
                            return;
                        }
                    }
                }
                else {
                    res
                        .clearCookie('access_token')
                        .clearCookie('refresh_token')
                        .status(403).json({
                        message: `Desole, une erreur est survenu : refresh token not valid`,
                    });
                    return;
                }
            }));
        }
        else {
            res
                .clearCookie('access_token')
                .clearCookie('refresh_token')
                .status(403).json({
                message: `Desole, une erreur est survenu : refresh token not found`,
            });
            return;
        }
    });
}
exports.refresh_token = refresh_token;
//# sourceMappingURL=tokens.controller.js.map