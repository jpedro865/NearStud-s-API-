import { Router } from 'express';
import { auth } from '../middleware/authentificator';
import { addFavoris, getFavoris, removeFavoris } from '../controllers/favoris.controller';
import { hasRigths } from '../middleware/permissions';

const favorisRouter: Router = Router();

favorisRouter.post(`/add/:id/:id_resto`, auth, hasRigths, addFavoris);
favorisRouter.delete(`/remove/:id/:id_resto`, auth, hasRigths, removeFavoris);
favorisRouter.get(`/:id`, auth, hasRigths, getFavoris);

export default favorisRouter;