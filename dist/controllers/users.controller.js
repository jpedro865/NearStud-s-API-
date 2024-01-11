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
exports.deleteFields = exports.addFields = exports.updateUser = exports.deleteUser = exports.resendEmail = exports.logout = exports.connect_user = exports.createUser = exports.getById = exports.getAll = void 0;
const mongodb_1 = require("mongodb");
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_validator_1 = require("../validator/users.validator");
const instance_1 = require("../database/instance");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Mailer_1 = require("../services/Mailer");
const environment_1 = __importDefault(require("../utils/environment"));
const tokens_service_1 = require("../services/tokens.service");
/**
 * Controller pour rechercher tous les utilisateurs
 *
 * @param req
 * @param res
 */
function getAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield instance_1.db.collection('users')
            .find()
            .toArray()
            .then((data) => {
            res.status(200).json(data);
        })
            .catch((err) => {
            res.status(500).json({
                "Server_Error": err
            });
        });
    });
}
exports.getAll = getAll;
/**
 * Controller pour rechercher un utilisateur par son Identifiant
 *
 * @param req
 * @param res
 */
function getById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongodb_1.ObjectId.isValid(req.params.id)) {
            yield instance_1.db.collection('users')
                .findOne({ _id: new mongodb_1.ObjectId(req.params.id) })
                .then((data) => {
                res.status(200).json(data);
            })
                .catch((err) => {
                res.status(500).json({
                    "Server_Error": err
                });
            });
        }
        else {
            res.status(500).json({
                'error': 'Not a valid ObjectId document'
            });
        }
    });
}
exports.getById = getById;
/**
 * Controller de creation d'un nouveau utilisateur
 *
 * @param req
 * @param res
 */
function createUser(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const validator = new users_validator_1.UserValidator();
        yield validator.validateUserCreation(req);
        req.body.pwd = yield crypt_pwd(req.body.pwd);
        req.body.admin = (_a = req.body.admin) !== null && _a !== void 0 ? _a : 0;
        req.body.verified = (_b = req.body.verified) !== null && _b !== void 0 ? _b : false;
        req.body.age = req.body.age ? req.body.age : 0;
        // inserting the user in the db if the data was validated
        if (validator.isValid()) {
            yield instance_1.db.collection('users')
                .insertOne(req.body)
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                const user_id = data.insertedId.toString();
                const mailer = new Mailer_1.Mailer();
                yield mailer.email_verif_send(user_id, req.body.email);
                res.status(201).json(data);
            }))
                .catch(error => {
                console.log(error);
                res.status(500).json(error);
            });
        }
        else {
            res.status(400).json({
                'error_list': validator.getErrors()
            });
        }
    });
}
exports.createUser = createUser;
/**
 * Controller pour connecter un User
 *
 * @param req
 * @param res
 */
function connect_user(req, res) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        const identifier = req.body.identifier;
        // verification si identifier existe
        const username = yield instance_1.db.collection('users').findOne({ username: identifier });
        const email = yield instance_1.db.collection('users').findOne({ email: identifier });
        let user;
        if (username) {
            user = username;
        }
        else if (email) {
            user = email;
        }
        else {
            res.status(400).json({
                "message": "L'identifiant n'existe pas dans notre base"
            });
            return;
        }
        // si utilisateur existe
        if (user) {
            // si utilisateur n'est pas verifie
            if (!user.verified) {
                res.status(401).json({
                    "message": "Ce compte n'est pas vérifier"
                });
                return;
            }
            else 
            // si utilisateur est verifie
            {
                const result = yield compare_hash(req.body.pwd, user.pwd);
                if (result) {
                    const token = jsonwebtoken_1.default.sign({
                        "_id": (_a = user._id) !== null && _a !== void 0 ? _a : "",
                        "email": (_b = user.email) !== null && _b !== void 0 ? _b : "",
                        "firstname": (_c = user.firstname) !== null && _c !== void 0 ? _c : "",
                        "lastname": (_d = user.lastname) !== null && _d !== void 0 ? _d : "",
                        "username": (_e = user.username) !== null && _e !== void 0 ? _e : "",
                        "age": (_f = user.age) !== null && _f !== void 0 ? _f : 0,
                        "admin": (_g = user.admin) !== null && _g !== void 0 ? _g : 0,
                    }, environment_1.default.SECRET_KEY, {
                        expiresIn: "24h",
                    });
                    const refresh_token = jsonwebtoken_1.default.sign({
                        "_id": user._id,
                    }, environment_1.default.KEY_TOKEN_REFRESH, {
                        expiresIn: "90 days",
                    });
                    if ((0, tokens_service_1.addRefreshToken)(user._id.toString(), refresh_token)) {
                        res
                            .cookie('access_token', token, {
                            httpOnly: true,
                            maxAge: 1000 * 60 * 15, // 15 minutes
                        })
                            .cookie('refresh_token', refresh_token, {
                            path: '/refresh',
                            httpOnly: true,
                            maxAge: 1000 * 3600 * 24 * 90, // 90 days
                        })
                            .status(200).json({
                            "message": "Connecté avec succés",
                        });
                        return;
                    }
                    else {
                        res.status(500).json({
                            "message": "Une erreur est survenu",
                        });
                        return;
                    }
                }
                else {
                    res.status(401).json({
                        "message": "Mauvais mot-de-passe",
                    });
                    return;
                }
            }
        }
        else 
        // si utilisateur n'existe pas
        {
            res.status(400).json({
                "message": "L'identifiant n'existe pas dans notre base"
            });
            return;
        }
    });
}
exports.connect_user = connect_user;
/**
 * logout
 *
 * @param req
 * @param res
 */
function logout(req, res) {
    res
        .clearCookie('access_token')
        .status(200)
        .json({
        "message": "Déconnecté avec succés",
    });
}
exports.logout = logout;
/**
 * resendEmail
 *
 * @param req
 * @param res
 */
function resendEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield instance_1.db.collection('users').findOne({ email: req.body.email });
        if (!user) {
            res.status(400).json({
                "message": "This email doesn't exist"
            });
        }
        else if (user.verified) {
            res.status(401).json({
                "message": "This account is already verified"
            });
        }
        else {
            const mailer = new Mailer_1.Mailer();
            const sent = yield mailer.email_verif_send(user._id.toString(), req.body.email);
            if (!sent.result) {
                res.status(500).json({
                    "message": sent.message
                });
            }
            else {
                res.status(200).json({
                    'message': sent.message
                });
            }
        }
    });
}
exports.resendEmail = resendEmail;
/**
* deleteUser
*
* @param req
* @param res
*/
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield instance_1.db.collection('users')
            .deleteOne({ _id: new mongodb_1.ObjectId(req.params.id) })
            .then((data) => {
            res.status(200).json(data);
        })
            .catch((err) => {
            res.status(500).json({
                "Server_Error": err
            });
        });
    });
}
exports.deleteUser = deleteUser;
/**
* updateUser
*
* @param req
* @param res
*/
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validator = new users_validator_1.UserValidator();
        yield validator.validateUserUpdate(req);
        if (validator.isValid()) {
            const jsonData = yield UpdateDataParse(req);
            yield instance_1.db.collection('users')
                .updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, Object.assign({}, jsonData))
                .then((data) => {
                res.status(200).json(data);
            })
                .catch((err) => {
                res.status(500).json({
                    "Server_Error": err
                });
            });
        }
        else {
            res.status(400).json({
                'error_list': validator.getErrors()
            });
        }
    });
}
exports.updateUser = updateUser;
/**
 * addFields
 *
 * ajouter des champs a tous les utilisateurs
 *
 * @param req
 * @param res
 */
function addFields(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const fields_name = JSON.stringify(req.body).match(/"([^"]*)"/g).join().replace(/"/g, '').split(',');
        let matchString = '{ "email": {"$exists": true}, ';
        for (const element of fields_name) {
            matchString += '"' + element + '": {"$exists": false},';
        }
        matchString += "}";
        matchString = matchString.replace(',}', '}');
        const matchData = JSON.parse(matchString);
        yield instance_1.db.collection('users')
            .updateMany(Object.assign({}, matchData), {
            $set: Object.assign({}, req.body)
        })
            .then((data) => {
            res.status(200).json(data);
        })
            .catch((err) => {
            res.status(500).json({
                "Server_Error": err
            });
        });
    });
}
exports.addFields = addFields;
/**
 * deleteFields
 *
 * supprimer des champs a tous les utilisateurs
 *
 * @param req
 * @param res
 */
function deleteFields(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield instance_1.db.collection('users')
            .updateMany({ email: { $exists: true } }, {
            $unset: Object.assign({}, req.body)
        })
            .then((data) => {
            res.status(200).json(data);
        })
            .catch((err) => {
            res.status(500).json({
                "Server_Error": err
            });
        });
    });
}
exports.deleteFields = deleteFields;
/** *************************** Helper Functions ****************************** */
/**
* Cryptage du mot-de-passe
*
* @param pwd
* @returns string
*/
function crypt_pwd(pwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield bcrypt_1.default.hash(pwd, 8);
        return hash;
    });
}
/**
* Compare hashed mdp et mdp string
*
* @param pwd
* @param hash
* @returns boolean
*/
function compare_hash(pwd, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield bcrypt_1.default.compare(pwd, hash);
        return result;
    });
}
function UpdateDataParse(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = '{"$set": {';
        req.body.firstname ? data += '"firstname": "' + req.body.firstname + '",' : data += '';
        req.body.lastname ? data += '"lastname": "' + req.body.lastname + '",' : data += '';
        req.body.username ? data += '"username": "' + req.body.username + '",' : data += '';
        req.body.email ? data += '"email": "' + req.body.email + '",' : data += '';
        req.body.pwd ? data += '"pwd":"' + (yield crypt_pwd(req.body.pwd)) + '",' : data += '';
        req.body.admin ? data += '"admin": ' + req.body.admin + ',' : data += '';
        data += '}}';
        data = data.replace(',}}', '}}');
        const jsonData = JSON.parse(data);
        return jsonData;
    });
}
//# sourceMappingURL=users.controller.js.map