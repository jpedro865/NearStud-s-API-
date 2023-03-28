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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getById = exports.getAll = void 0;
const mongodb_1 = require("mongodb");
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
//# sourceMappingURL=users.controller.js.map