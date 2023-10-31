"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProsValidator = void 0;
const validator_1 = require("./validator");
class ProsValidator extends validator_1.Validator {
    /**
     * validateProCreation
     * @param req
     */
    validateProCreation(req) {
        const pro = req.body;
        // check valeurs qui ne peuvent pas etre vides
        this.isEmpty(pro.nom);
        this.isEmpty(pro.adresse.cp);
        this.isEmpty(pro.adresse.ville);
        this.isEmpty(pro.adresse.rue);
        this.isEmpty(pro.adresse.pays);
        this.isEmpty(pro.coord);
        this.isEmpty(pro.cuisine);
        if (this.isValid()) {
            this.isString(pro.nom);
            this.isNumber(pro.adresse.cp);
            this.isString(pro.adresse.ville);
            this.isString(pro.adresse.rue);
            this.isString(pro.adresse.pays);
            this.isNumber(pro.coord[0]);
            this.isNumber(pro.coord[1]);
            this.isArrayOfString(pro.cuisine);
        }
    }
}
exports.ProsValidator = ProsValidator;
//# sourceMappingURL=pros.validator.js.map