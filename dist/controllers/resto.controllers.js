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
exports.getRandomRestos = exports.bestRestos = exports.searchResto = exports.getRestosZone = exports.getRestosFavoris = exports.getAllResto = exports.getRestoById = exports.createResto = void 0;
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
                    "message": e
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
                "message": e
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
function getRestosFavoris(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const favoris_string = req.body.favoris;
        var favoris = [];
        // Convertir les string en ObjectId
        // necessaire pour la requete
        for (var i = 0; i < favoris_string.length; i++) {
            favoris[i] = new mongodb_1.ObjectId(favoris_string[i]);
        }
        yield instance_1.db.collection('restaurants')
            .find({ _id: { $in: favoris } })
            .toArray()
            .then(data => {
            res.status(200).json(data);
        })
            .catch(e => {
            res.status(500).json({
                "message": e
            });
        });
    });
}
exports.getRestosFavoris = getRestosFavoris;
/**
 * getRestosZone
 *
 * renvoi les 20 restaurants le mieux note autour de la position
 *
 * @param req
 * @param res
 */
function getRestosZone(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var cornerBL = req.body.cornerBL;
        var cornerTR = req.body.cornerTR;
        if (!cornerBL || !cornerTR) {
            res.status(400).json({
                "message": "Les coordonnees sont obligatoires"
            });
            return;
        }
        yield instance_1.db.collection('restaurants')
            .find({
            "coord.lat": { $gt: cornerBL.lat, $lt: cornerTR.lat },
            "coord.lng": { $gt: cornerBL.lng, $lt: cornerTR.lng }
        })
            .toArray()
            .then(data => {
            res.status(200).json(data);
        })
            .catch(e => {
            res.status(500).json({
                "message": e.message
            });
        });
    });
}
exports.getRestosZone = getRestosZone;
/**
 * searchResto
 *
 * recherche un restaurant par son nom ou sa cuisine
 *
 * @param req
 * @param res
 */
function searchResto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const search = req.body.search;
        yield instance_1.db.collection('restaurants')
            .find({
            $or: [
                {
                    nom: {
                        $regex: search, $options: 'i'
                    }
                },
                {
                    cuisine: {
                        $regex: search, $options: 'i'
                    }
                }
            ]
        })
            .toArray()
            .then(data => {
            res.status(200).json(data);
        })
            .catch(e => {
            res.status(500).json({
                "message": e.message
            });
        });
    });
}
exports.searchResto = searchResto;
/**
 * bestRestos
 *
 * renvoi les 10 meilleurs restaurants
 *
 * @param req
 * @param res
 */
function bestRestos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield instance_1.db.collection('restaurants')
            .find()
            .sort({ note: -1 })
            .limit(10)
            .toArray()
            .then(data => {
            res.status(200).json(data);
        })
            .catch(e => {
            res.status(500).json({
                "message": e.message
            });
        });
    });
}
exports.bestRestos = bestRestos;
/**
 * getRandom
 *
 * renvoi 10 restaurants au hasard
 *
 * @param req
 * @param res
 */
function getRandomRestos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield instance_1.db.collection('restaurants')
            .aggregate([
            {
                $sample: {
                    size: 10
                }
            }
        ])
            .limit(10)
            .toArray()
            .then(data => {
            res.status(200).json(data);
        })
            .catch(e => {
            res.status(500).json({
                "message": e.message
            });
        });
    });
}
exports.getRandomRestos = getRandomRestos;
//# sourceMappingURL=resto.controllers.js.map