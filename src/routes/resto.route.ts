import { Router } from 'express';
import { auth } from '../middleware/authentificator';
import { createResto, getRestoById, getAllResto, getRestosFavoris, getRestosZone, searchResto, getRandomRestos, bestRestos } from '../controllers/resto.controllers';

const restoRouter: Router = Router();

restoRouter.post(`/add`, auth, createResto);
restoRouter.get(`/best`, auth, bestRestos);
restoRouter.get(`/random`, auth, getRandomRestos);
restoRouter.get(`/search`, auth, searchResto);
restoRouter.get(`/zone`, auth, getRestosZone);
restoRouter.get('/favoris', auth, getRestosFavoris);
restoRouter.get('/:id', auth, getRestoById);
restoRouter.get('/', auth, getAllResto);

export default restoRouter;