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
exports.email_verif_send = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const tokens_service_1 = require("./tokens.service");
const fs_1 = require("fs");
const path_1 = require("path");
const handlebars_1 = require("handlebars");
require('dotenv').config();
function email_verif_send(user_id, user_email) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporteur = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.E_PASS,
            }
        });
        const tokenAdd = yield (0, tokens_service_1.addVerifToken)(user_id);
        if (tokenAdd) {
            const token = yield (0, tokens_service_1.getTokenFromId)(tokenAdd.insertedId.toString());
            const html = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../emails/verif_email.html'), 'utf-8');
            const template = (0, handlebars_1.compile)(html);
            const variables = {
                link: process.env.BASE_URL.concat(`/users/verif-email/${token}`.toString())
            };
            const compiledHtml = template(variables);
            const emailOptions = {
                from: process.env.EMAIL,
                to: user_email,
                subject: "Verification compte NearStud's",
                html: compiledHtml
            };
            yield transporteur.sendMail(emailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return false;
                }
                else {
                    return true;
                }
            });
        }
        else {
            return false;
        }
    });
}
exports.email_verif_send = email_verif_send;
//# sourceMappingURL=emailer.services.js.map