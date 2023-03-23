"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const UserRouter = (0, express_1.Router)();
UserRouter.get('/', users_controller_1.getAll);
UserRouter.get('/:id', users_controller_1.getById);
exports.default = UserRouter;
//# sourceMappingURL=users.route.js.map