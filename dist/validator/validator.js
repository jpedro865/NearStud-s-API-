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
        if (value == null || value == undefined || value == '' || value.length == 0) {
            this.setError('This case is empty');
        }
    }
    /**
     * isMail
     *
     * @param value
     */
    isMail(value) {
        const expression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!expression.test(value)) {
            this.setError('Email not valid');
        }
    }
    /**
     * isNumber
     *
     * @param value
     */
    isNumber(value) {
        if (isNaN(value)) {
            this.setError('This value is not a number');
        }
    }
    /**
     * isBoolean
     *
     * @param value
     */
    isBoolean(value) {
        if (typeof value != 'boolean') {
            this.setError('This value is not a boolean');
        }
    }
    /**
     * isString
     *
     * @param value
     */
    isString(value) {
        if (typeof value != 'string') {
            this.setError('This value is not a string');
        }
    }
    isArrayOfString(value) {
        if (Array.isArray(value)) {
            var somethingIsNotString = false;
            value.forEach(function (item) {
                if (typeof item !== 'string') {
                    somethingIsNotString = true;
                }
            });
            console.log(!somethingIsNotString && value.length > 0);
            if (somethingIsNotString && value.length > 0) {
                this.setError('This value is not an array of string');
            }
        }
        else {
            this.setError('This value is not an array of string');
        }
    }
    /**
     * isValid
     *
     * @returns boolean
     */
    isValid() {
        return this.isvalid;
    }
    /**
     * setError
     *
     * @param message
     */
    setError(message) {
        this.errors.push(message);
        this.isvalid = false;
    }
    /**
     * getErrors
     *
     * @returns Array<string>
     */
    getErrors() {
        return this.errors;
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map