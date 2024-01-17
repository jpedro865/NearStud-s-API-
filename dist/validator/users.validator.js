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
     * validateUserCreation
     *
     * Verifies if the value passes to create the new User are valid
     * and verifies if no other user with same username or email already
     *  exists in the db
     *
     * @param req
     */
    validateUserCreation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            this.isEmpty(user.email, "Email non renseigné");
            this.isEmpty(user.firstname, "Prénom non renseigné");
            this.isEmpty(user.lastname, "Nom non renseigné");
            this.isEmpty(user.username, "Pseudo non renseigné");
            this.isEmpty(user.pwd, "Mot de passe non renseigné");
            this.isMail(user.email);
            this.isEmpty(user.age, 'Age non renseigné');
            this.userIsAdult(user.age);
            if (this.isValid()) {
                this.isNumber(user.age);
                yield this.checkUserNameExists(user.username);
                yield this.checkEmailExists(user.email);
            }
        });
    }
    /**
     * validateUserUpdate
     *
     * @param req
     */
    validateUserUpdate(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            if (user.email) {
                this.isMail(user.email);
                yield this.checkEmailExists(user.email);
            }
            if (user.username) {
                yield this.checkUserNameExists(user.username);
            }
            if (user.pwd) {
                this.isEmpty(user.pwd);
            }
            if (user.firstname) {
                this.isEmpty(user.firstname);
            }
            if (user.lastname) {
                this.isEmpty(user.lastname);
            }
            if (user.admin) {
                this.isEmpty(user.admin);
                this.isBoolean(user.admin);
            }
        });
    }
    /**
     * Verifies if the User username we want to create
     * already exists in the db
     *
     * @param username
     *
     * @return void
     */
    checkUserNameExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield instance_1.db.collection('users').findOne({ username });
            if (result != null) {
                this.setError('This username already exists');
            }
        });
    }
    /**
     * Verifie if the user email being created already exists in db
     *
     * @param email
     */
    checkEmailExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield instance_1.db.collection('users').findOne({ email });
            if (result != null) {
                this.setError('This E-mail already exists');
            }
        });
    }
    /**
     * userIsAdult
     *
     * verifie l'age de l'utilisateur
     *
     * @param int age
     *
     * @return void
     */
    userIsAdult(age) {
        if (age < 16) {
            this.setError('Vous devez avoir au moins 16 ans pour vous inscrire');
        }
    }
}
exports.UserValidator = UserValidator;
//# sourceMappingURL=users.validator.js.map