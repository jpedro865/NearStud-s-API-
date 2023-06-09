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
exports.resendEmail = exports.logout = exports.connect_user = exports.createUser = exports.getById = exports.getAll = void 0;
const mongodb_1 = require("mongodb");
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_validator_1 = require("../validator/users.validator");
const instance_1 = require("../database/instance");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Mailer_1 = require("../services/Mailer");
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
    return __awaiter(this, void 0, void 0, function* () {
        const validator = new users_validator_1.UserValidator();
        yield validator.validateUserCreation(req);
        req.body.pwd = yield crypt_pwd(req.body.pwd);
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
            res.status(403).json({
                "error": "This identifier doesn't exist"
            });
        }
        // si utilisateur existe
        if (user) {
            // si utilisateur n'est pas verifie
            if (!user.verified) {
                res.status(403).json({
                    "error": "This account is not verified"
                });
            }
            else 
            // si utilisateur est verifie
            {
                const result = yield compare_hash(req.body.pwd, user.pwd);
                if (result) {
                    const token = jsonwebtoken_1.default.sign({
                        "_id": user._id,
                    }, process.env.SECRET_KEY, {
                        expiresIn: "24h",
                    });
                    res
                        .cookie('access_token', token, {
                        httpOnly: true,
                        maxAge: 1000 * 3600 * 24,
                    })
                        .status(200).json({
                        "Message": "Logged in successfully",
                    });
                }
                else {
                    res.status(403).json({
                        "error": "Wrong password",
                    });
                }
            }
        }
        else 
        // si utilisateur n'existe pas
        {
            res.status(403).json({
                "error": "This identifier doesn't exist"
            });
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
        "message": "Logged out successfully",
    });
}
exports.logout = logout;
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
function resendEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield instance_1.db.collection('users').findOne({ email: req.body.email });
        if (!user) {
            res.status(403).json({
                "error": "This email doesn't exist"
            });
        }
        else if (user.verified) {
            res.status(403).json({
                "error": "This account is already verified"
            });
        }
        else {
            const mailer = new Mailer_1.Mailer();
            yield mailer.email_verif_send(user._id.toString(), req.body.email);
            res.status(200).json({
                'message': 'Email sent'
            });
        }
    });
}
exports.resendEmail = resendEmail;
//# sourceMappingURL=users.controller.js.map