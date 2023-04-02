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
const users_services_1 = require("./users.services");
const tokens_service_1 = require("./tokens.service");
require('dotenv').config();
function email_verif_send(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporteur = nodemailer_1.default.createTransport({
            host: process.env.E_HOST,
            service: "",
            secure: false,
            auth: {
                user: process.env.MAIL,
                pass: process.env.E_PASS,
            }
        });
        const user = (yield (0, users_services_1.getUserById)(user_id)).user;
        if (user) {
            yield (0, tokens_service_1.addVerifToken)(user_id);
            yield transporteur.sendMail({
                from: process.env.EMAIL,
                to: user.email,
                subject: "Verification compte NearStud's",
                html: '../emails/verif_email.html'
            }).then(() => {
                return true;
            }).catch(() => {
                return false;
            });
        }
        return false;
    });
}
exports.email_verif_send = email_verif_send;
//# sourceMappingURL=emailer.services.js.map