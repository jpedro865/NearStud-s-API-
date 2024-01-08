"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRigths = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function hasRigths(req, res, next) {
    const tokenData = jsonwebtoken_1.default.decode(req.cookies.access_token);
    console.log(tokenData, req.params.id);
    if (req.params.id === (tokenData === null || tokenData === void 0 ? void 0 : tokenData._id) || (tokenData === null || tokenData === void 0 ? void 0 : tokenData.admin) === 1) {
        next();
    }
    else {
        res.status(403).json({
            message: "Vous n'avez pas les droits pour effectuer cette action",
        });
    }
}
exports.hasRigths = hasRigths;
//# sourceMappingURL=permissions.js.map