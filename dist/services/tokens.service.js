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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVerifToken = void 0;
const instance_1 = require("../database/instance");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
function addVerifToken(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign({
            _id: user_id,
        }, process.env.SECRET_KEY, {
            expiresIn: 1800,
        });
        yield instance_1.db.collection('tokens')
            .insertOne({
            user_id,
            token,
            used: false
        })
            .then(() => {
            return true;
        })
            .catch(() => {
            return false;
        });
    });
}
exports.addVerifToken = addVerifToken;
//# sourceMappingURL=tokens.service.js.map