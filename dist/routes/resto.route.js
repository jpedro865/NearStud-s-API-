"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentificator_1 = require("../middleware/authentificator");
const resto_controllers_1 = require("../controllers/resto.controllers");
const restoRouter = (0, express_1.Router)();
restoRouter.post(`/add`, authentificator_1.auth, resto_controllers_1.createResto);
restoRouter.get('/favoris', authentificator_1.auth, resto_controllers_1.getRestosFavoris);
restoRouter.get('/:id', authentificator_1.auth, resto_controllers_1.getRestoById);
restoRouter.get('/', authentificator_1.auth, resto_controllers_1.getAllResto);
exports.default = restoRouter;
//# sourceMappingURL=resto.route.js.map