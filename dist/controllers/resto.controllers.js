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
exports.getRestoFavoris = exports.getAllResto = exports.getRestoById = exports.createResto = void 0;
const mongodb_1 = require("mongodb");
const instance_1 = require("../database/instance");
const resto_validator_1 = require("../validator/resto.validator");
/**
 * createResto
 *
 * @param req
 * @param res
 */
function createResto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validator = new resto_validator_1.RestoValidator();
        validator.validateRestoCreation(req);
        if (validator.isValid()) {
            yield instance_1.db.collection('restaurants')
                .insertOne(req.body)
                .then((data) => {
                res.status(201).json(data);
            })
                .catch(e => {
                res.status(500).json({
                    "ERREUR_SERVER": e
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
exports.createResto = createResto;
/**
 * getRestoById
 *
 * @param req
 * @param res
 */
function getRestoById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const _id = req.params.id;
        yield instance_1.db.collection('restaurants')
            .findOne({ _id: new mongodb_1.ObjectId(_id) })
            .then(data => {
            res.status(200).json(data);
        })
            .catch(e => {
            res.status(500).json({
                "ERREUR_SERVER": e
            });
        });
    });
}
exports.getRestoById = getRestoById;
/**
 * getAllResto
 *
 * @param req
 * @param res
 */
function getAllResto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield instance_1.db.collection('restaurants')
            .find()
            .toArray()
            .then(data => {
            res.status(200).json(data);
        })
            .catch(e => {
            res.status(500).json({
                "ERREUR_SERVER": e
            });
        });
    });
}
exports.getAllResto = getAllResto;
/**
 * updateResto
 *
 * @param req
 * @param res
 */
function getRestoFavoris(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const favoris = req.body.favoris;
        var restoFavoris = [];
        for (const id_resto of favoris) {
            yield instance_1.db.collection('restaurants')
                .findOne({ _id: new mongodb_1.ObjectId(id_resto) })
                .then(data => {
                restoFavoris.push(data);
            })
                .catch(e => {
                res.status(500).json({
                    "ERREUR_SERVER": e
                });
            });
        }
    });
}
exports.getRestoFavoris = getRestoFavoris;
//# sourceMappingURL=resto.controllers.js.map