"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const authentificator_1 = require("../middleware/authentificator");
const tokens_controller_1 = require("../controllers/tokens.controller");
const UserRouter = (0, express_1.Router)();
UserRouter.get('/verif-email/:token', tokens_controller_1.valid_email_token);
UserRouter.get('/', authentificator_1.auth, users_controller_1.getAll);
UserRouter.get('/:id', authentificator_1.auth, users_controller_1.getById);
UserRouter.post('/register', users_controller_1.createUser);
UserRouter.post('/connect', users_controller_1.connect_user);
UserRouter.post('/logout', users_controller_1.logout);
UserRouter.post('/resend-email', users_controller_1.resendEmail);
UserRouter.delete('/:id', authentificator_1.auth, users_controller_1.deleteUser);
exports.default = UserRouter;
//# sourceMappingURL=users.route.js.map