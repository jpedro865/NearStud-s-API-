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
exports.verifyRefreshToken = exports.addRefreshToken = exports.setUsedToken = exports.findByUserId = exports.getTokenFromId = exports.addVerifToken = void 0;
const instance_1 = require("../database/instance");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
require('dotenv').config();
/** *********************************  Emails tokens ************************************* */
/**
 * addVerifToken
 *
 * ajoute un token de verification pour l'utilisateur
 *
 * @param user_id
 * @returns result of the insert
 */
function addVerifToken(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const hasToken = yield instance_1.db.collection('tokens').findOne({ user_id });
        const token = jsonwebtoken_1.default.sign({
            _id: user_id,
        }, process.env.KEY_TOKEN, {
            expiresIn: 1800,
        });
        if (hasToken) {
            const updated = yield instance_1.db.collection('tokens').updateOne({ _id: hasToken._id }, { $set: { token, used: false } });
            if (updated.acknowledged) {
                return {
                    acknowledged: updated.acknowledged,
                    token_id: hasToken._id
                };
            }
        }
        else {
            const inserted = yield instance_1.db.collection('tokens')
                .insertOne({
                user_id,
                token,
                used: false
            });
            if (inserted.acknowledged) {
                return {
                    acknowledged: inserted.acknowledged,
                    token_id: inserted.insertedId
                };
            }
        }
    });
}
exports.addVerifToken = addVerifToken;
/**
 * getTokenFromId
 *
 * trouve le token en fonction de son id
 *
 * @param token_id
 * @returns token
 */
function getTokenFromId(token_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield instance_1.db.collection('tokens').findOne({ _id: new mongodb_1.ObjectId(token_id) });
        return token.token;
    });
}
exports.getTokenFromId = getTokenFromId;
/**
 * findByUserId
 *
 * trouve le token en fonction de l'id de l'utilisateur
 *
 * @param user_id
 * @returns token
 */
function findByUserId(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield instance_1.db.collection('tokens').findOne({ user_id });
        return token;
    });
}
exports.findByUserId = findByUserId;
/**
 * setUsedToken
 *
 * rend le token utilisé
 *
 * @param token_id
 * @returns result of the update
 */
function setUsedToken(token_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = yield instance_1.db.collection('tokens').updateOne({ _id: new mongodb_1.ObjectId(token_id) }, { $set: { used: true } });
        return update;
    });
}
exports.setUsedToken = setUsedToken;
/** *********************************  Refresh Tokens ************************************* */
/**
 * addRefreshToken
 *
 * ajoute un token de rafraichissement pour l'utilisateur
= *
 * @param user_id
 * @returns result of the insert
 */
function addRefreshToken(user_id, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const hasToken = yield instance_1.db.collection('refresh_tokens').findOne({ user_id });
        if (hasToken) {
            const updated = yield instance_1.db.collection('refresh_tokens').updateOne({ _id: hasToken._id }, { $set: { token, modified_at: new Date() } });
            if (updated.acknowledged) {
                return true;
            }
            return false;
        }
        else {
            const inserted = yield instance_1.db.collection('refresh_tokens')
                .insertOne({
                user_id,
                token,
                modified_at: new Date(),
            });
            if (inserted.acknowledged) {
                return true;
            }
            return false;
        }
    });
}
exports.addRefreshToken = addRefreshToken;
/**
 * verifyRefreshToken
 *
 * verifie que le token de rafraichissement est valide
 *
 * @param token_id
 * @returns token
 */
function verifyRefreshToken(user_id, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenInDB = yield instance_1.db.collection('refresh_tokens').findOne({ user_id });
        return token === tokenInDB.token;
    });
}
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=tokens.service.js.map