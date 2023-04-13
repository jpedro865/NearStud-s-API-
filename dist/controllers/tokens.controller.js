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
exports.valid_email_token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokens_service_1 = require("../services/tokens.service");
const users_services_1 = require("../services/users.services");
function valid_email_token(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.params.token;
        jsonwebtoken_1.default.verify(token, process.env.KEY_TOKEN, (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.status(403).json({
                    'Email verification': {
                        'message': "There was an error in the email verification."
                    }
                });
            }
            else {
                const token = yield (0, tokens_service_1.findByUserId)(data._id);
                if (token && !token.used) {
                    yield (0, tokens_service_1.setUsedToken)(token._id.toString());
                    const verified = yield (0, users_services_1.verifyUser)(token.user_id);
                    if (verified) {
                        res.status(200).json({
                            'Email verification': {
                                'message': "Your Email has been verified !!!!"
                            }
                        });
                    }
                    else {
                        res.status(403).json({
                            'Email verification': {
                                'message': "There was an error in the email verification."
                            }
                        });
                    }
                }
                else {
                    res.status(403).json({
                        'Email verification': {
                            'message': "There was an error in the email verification."
                        }
                    });
                }
            }
        }));
    });
}
exports.valid_email_token = valid_email_token;
//# sourceMappingURL=tokens.controller.js.map