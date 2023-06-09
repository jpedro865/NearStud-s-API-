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
exports.setUsedToken = exports.findByUserId = exports.getTokenFromId = exports.addVerifToken = void 0;
const instance_1 = require("../database/instance");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
require('dotenv').config();
function addVerifToken(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const hasToken = yield instance_1.db.collection('tokens').findOne({ user_id });
        const token = jsonwebtoken_1.default.sign({
            _id: user_id,
        }, process.env.KEY_TOKEN, {
            expiresIn: 1800,
        });
        if (hasToken) {
            if (!hasToken.used) {
                yield instance_1.db.collection('tokens').updateOne({ _id: hasToken._id }, { $set: { token, used: false } });
            }
        }
        else {
            return yield instance_1.db.collection('tokens')
                .insertOne({
                user_id,
                token,
                used: false
            });
        }
    });
}
exports.addVerifToken = addVerifToken;
function getTokenFromId(token_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield instance_1.db.collection('tokens').findOne({ _id: new mongodb_1.ObjectId(token_id) });
        return token.token;
    });
}
exports.getTokenFromId = getTokenFromId;
function findByUserId(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield instance_1.db.collection('tokens').findOne({ user_id });
        return token;
    });
}
exports.findByUserId = findByUserId;
function setUsedToken(token_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = yield instance_1.db.collection('tokens').updateOne({ _id: new mongodb_1.ObjectId(token_id) }, { $set: { used: true } });
        return update;
    });
}
exports.setUsedToken = setUsedToken;
//# sourceMappingURL=tokens.service.js.map