import { Router } from 'express';
import { auth } from '../middleware/authentificator';
import { createResto, getRestoById, getAllResto, getRestosFavoris, getRestosZone, searchResto } from '../controllers/resto.controllers';

const restoRouter: Router = Router();

restoRouter.post(`/add`, auth, createResto);
restoRouter.get(`/search`, auth, searchResto);
restoRouter.get(`/zone`, auth, getRestosZone);
restoRouter.get('/favoris', auth, getRestosFavoris);
restoRouter.get('/:id', auth, getRestoById);
restoRouter.get('/', auth, getAllResto);

export default restoRouter;