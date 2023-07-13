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
exports.createResto = void 0;
const instance_1 = require("../database/instance");
const resto_validator_1 = require("../validator/resto.validator");
function createResto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validator = new resto_validator_1.RestoValidator();
        validator.validateRestoCreation(req);
        yield instance_1.db.collection('restaurants')
            .insertOne(req.body);
    });
}
exports.createResto = createResto;
//# sourceMappingURL=resto.controllers.js.map