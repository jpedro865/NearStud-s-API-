"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const authentificator_1 = require("../middleware/authentificator");
const UserRouter = (0, express_1.Router)();
UserRouter.get('/', authentificator_1.auth, users_controller_1.getAll);
UserRouter.get('/:id', authentificator_1.auth, users_controller_1.getById);
UserRouter.post('/', users_controller_1.createUser);
UserRouter.post('/connect', users_controller_1.connect_user);
UserRouter.post('/logout', users_controller_1.logout);
exports.default = UserRouter;
//# sourceMappingURL=users.route.js.map