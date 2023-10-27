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
exports.prosController = void 0;
const mongodb_1 = require("mongodb");
const instance_1 = require("../database/instance");
const resto_validator_1 = require("../validator/resto.validator");
exports.prosController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, restaurant } = req.body;
            const validator = new resto_validator_1.RestoValidator();
            validator.validateRestoCreation(restaurant);
            if (validator.isValid()) {
                return res.status(400).json(validator.getErrors());
            }
            const professional = {
                _id: new mongodb_1.ObjectId(),
                name,
                email,
                password,
                restaurant,
            };
            try {
                const result = yield instance_1.db.collection('professionals').insertOne(professional);
                return res.status(201).json(result.acknowledged);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const professional = yield instance_1.db.collection('professionals').findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!professional) {
                    return res.status(404).json({ error: 'Professional not found' });
                }
                return res.json(professional);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, email, password, restaurant } = req.body;
            const validator = new resto_validator_1.RestoValidator();
            validator.validateRestoCreation(restaurant);
            if (validator.isValid()) {
                return res.status(400).json(validator.getErrors());
            }
            const professional = {
                _id: new mongodb_1.ObjectId(id),
                name,
                email,
                password,
                restaurant,
            };
            try {
                const result = yield instance_1.db.collection('professionals').replaceOne({ _id: new mongodb_1.ObjectId(id) }, professional);
                if (result.modifiedCount === 0) {
                    return res.status(404).json({ error: 'Professional not found' });
                }
                return res.json(professional);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const result = yield instance_1.db.collection('professionals').deleteOne({ _id: new mongodb_1.ObjectId(id) });
                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: 'Professional not found' });
                }
                return res.status(204).send();
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
};
//# sourceMappingURL=pros.controller.js.map