"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
/**
 * Validator class
 *
 */
class Validator {
    constructor() {
        this.isvalid = true;
        this.errors = new Array;
    }
    /**
     * Verifies if a value is empty
     * @param value
     * @returns boolean
     */
    isEmpty(value) {
        if (value == null || value == undefined) {
            this.setError('This case is empty');
        }
    }
    isMail(value) {
        const expression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!expression.test(value)) {
            this.setError('Email not valid');
        }
    }
    isValid() {
        return this.isvalid;
    }
    setError(message) {
        this.errors.push(message);
        this.isvalid = false;
    }
    getErrors() {
        return this.errors;
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map