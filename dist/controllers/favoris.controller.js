"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavoris = exports.removeFavoris = exports.addFavoris = void 0;
const mongodb_1 = require("mongodb");
const instance_1 = require("../database/instance");
/**
 * addFavoris
 *
 * @param req
 * @param res
 */
function addFavoris(req, res) {
    const _id = req.params.id;
    const id_resto = req.params.id_resto;
    instance_1.db.collection('users')
        .updateOne({ _id: new mongodb_1.ObjectId(_id) }, { $addToSet: { favoris: id_resto } })
        .then(data => {
        res.status(200).json(data);
    })
        .catch(e => {
        res.status(500).json({
            "ERREUR_SERVER": e
        });
    });
}
exports.addFavoris = addFavoris;
/**
 * removeFavoris
 *
 * @param req
 * @param res
 */
function removeFavoris(req, res) {
    const _id = req.params.id;
    const id_resto = req.params.id_resto;
    instance_1.db.collection('users')
        .updateOne({ _id: new mongodb_1.ObjectId(_id) }, { $pull: { favoris: id_resto } })
        .then(data => {
        res.status(200).json(data);
    })
        .catch(e => {
        res.status(500).json({
            "ERREUR_SERVER": e
        });
    });
}
exports.removeFavoris = removeFavoris;
/**
 * getFavoris
 *
 * @param req
 * @param res
 */
function getFavoris(req, res) {
    const _id = req.params.id;
    instance_1.db.collection('users')
        .findOne({ _id: new mongodb_1.ObjectId(_id) })
        .then(data => {
        if (!data.favoris) {
            res.status(200).json([]);
        }
        else {
            res.status(200).json(data.favoris);
        }
    })
        .catch(e => {
        res.status(500).json({
            "ERREUR_SERVER": e
        });
    });
}
exports.getFavoris = getFavoris;
//# sourceMappingURL=favoris.controller.js.map