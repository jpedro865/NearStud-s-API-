import { Router } from 'express';
import { auth } from '../middleware/authentificator';
import { createResto, getRestoById, getAllResto, getRestosFavoris } from '../controllers/resto.controllers';

const restoRouter: Router = Router();

restoRouter.post(`/add`, auth, createResto);
restoRouter.get('/favoris', auth, getRestosFavoris);
restoRouter.get('/:id', auth, getRestoById);
restoRouter.get('/', auth, getAllResto);

export default restoRouter;