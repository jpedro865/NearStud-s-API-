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
exports.createUser = exports.getById = exports.getAll = void 0;
const mongodb_1 = require("mongodb");
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_validator_1 = require("../validator/users.validator");
const instance_1 = require("../database/instance");
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
                .then(data => {
                res.status(201).json(data);
            })
                .catch(error => {
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
function crypt_pwd(pwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield bcrypt_1.default.hash(pwd, 8);
        return hash;
    });
}
function compare_hash(pwd, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield bcrypt_1.default.compare(pwd, hash);
        return result;
    });
}
//# sourceMappingURL=users.controller.js.map