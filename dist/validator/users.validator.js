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
exports.UserValidator = void 0;
const instance_1 = require("../database/instance");
const validator_1 = require("./validator");
class UserValidator extends validator_1.Validator {
    /**
     * Verifies if the value passes to create the new User are valid
     * and verifies if no other user with same username or email already
     *  exists in the db
     *
     * @param req
     */
    validateUserCreation(req) {
        const user = req.body;
        this.checkUserNameExists(user.username);
    }
    /**
     * Verifies if the User username we want to create
     * already exists in the db
     *
     * @param username
     */
    checkUserNameExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield instance_1.client.connect();
            yield instance_1.db.collection('users')
                .findOne({ username })
                .then(data => {
                if (data == null) {
                    this.setError();
                }
            });
            yield instance_1.client.close();
        });
    }
}
exports.UserValidator = UserValidator;
//# sourceMappingURL=users.validator.js.map