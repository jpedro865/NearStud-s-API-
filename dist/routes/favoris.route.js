"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentificator_1 = require("../middleware/authentificator");
const favoris_controller_1 = require("../controllers/favoris.controller");
const permissions_1 = require("../middleware/permissions");
const favorisRouter = (0, express_1.Router)();
favorisRouter.post(`/add/:id/:id_resto`, authentificator_1.auth, permissions_1.hasRigths, favoris_controller_1.addFavoris);
favorisRouter.delete(`/remove/:id/:id_resto`, authentificator_1.auth, permissions_1.hasRigths, favoris_controller_1.removeFavoris);
favorisRouter.get(`/:id`, authentificator_1.auth, permissions_1.hasRigths, favoris_controller_1.getFavoris);
exports.default = favorisRouter;
//# sourceMappingURL=favoris.route.js.map