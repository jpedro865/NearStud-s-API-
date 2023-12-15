"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestoValidator = void 0;
const validator_1 = require("./validator");
class RestoValidator extends validator_1.Validator {
    /**
     * validateRestoCreation
     * @param req
     */
    validateRestoCreation(req) {
        const resto = req.body;
        // check valeurs qui ne peuvent pas etre vides
        this.isEmpty(resto.nom);
        this.isEmpty(resto.adresse.cp);
        this.isEmpty(resto.adresse.ville);
        this.isEmpty(resto.adresse.rue);
        this.isEmpty(resto.adresse.pays);
        this.isEmpty(resto.coord);
        this.isEmpty(resto.cuisine);
        if (this.isValid()) {
            this.isString(resto.nom);
            this.isNumber(resto.adresse.cp);
            this.isString(resto.adresse.ville);
            this.isString(resto.adresse.rue);
            this.isString(resto.adresse.pays);
            this.isNumber(resto.coord.lat);
            this.isNumber(resto.coord.lng);
            this.isArrayOfString(resto.cuisine);
        }
    }
}
exports.RestoValidator = RestoValidator;
//# sourceMappingURL=resto.validator.js.map