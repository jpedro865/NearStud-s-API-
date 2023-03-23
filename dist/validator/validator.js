"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
class Validator {
    constructor() {
        this.isvalid = true;
    }
    Validator(req) {
        this.req = req;
    }
    /**
     * Verifies if a value is empty
     * @param value
     * @returns boolean
     */
    isEmpty(value) {
        if (value == null || value == undefined) {
            this.isvalid = true;
        }
        else {
            this.isvalid = false;
        }
    }
    isValid() {
        return this.isvalid;
    }
    setError() {
        this.isvalid == false;
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map