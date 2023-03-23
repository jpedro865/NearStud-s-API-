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
exports.getById = exports.getAll = void 0;
const mongodb_1 = require("mongodb");
const instance_1 = require("../database/instance");
function getAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield instance_1.client.connect();
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
        yield instance_1.client.close();
    });
}
exports.getAll = getAll;
function getById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongodb_1.ObjectId.isValid(req.params.id)) {
            yield instance_1.client.connect();
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
            yield instance_1.client.close();
        }
        else {
            res.status(500).json({
                'error': 'Not a valid ObjectId document'
            });
        }
    });
}
exports.getById = getById;
//# sourceMappingURL=users.controller.js.map