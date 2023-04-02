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
exports.getUserById = void 0;
const mongodb_1 = require("mongodb");
const instance_1 = require("../database/instance");
function getUserById(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongodb_1.ObjectId.isValid(user_id)) {
            yield instance_1.db.collection('users')
                .findOne({ _id: new mongodb_1.ObjectId(user_id) })
                .then((data) => {
                return {
                    'user': data,
                    'error': false
                };
            })
                .catch((err) => {
                return {
                    'user': false,
                    "error": true
                };
            });
        }
        else {
            return {
                'user': false,
                'error': true
            };
        }
    });
}
exports.getUserById = getUserById;
//# sourceMappingURL=users.services.js.map