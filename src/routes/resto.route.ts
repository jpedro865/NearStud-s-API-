import { Router } from 'express';
import { auth } from '../middleware/authentificator';
import { createResto, getRestoById, getAllResto } from '../controllers/resto.controllers';

const restoRouter: Router = Router();

restoRouter.post(`/add`, auth, createResto);
restoRouter.get('/:id', auth, getRestoById);
restoRouter.get('/', auth, getAllResto);
restoRouter.get('/favoris', auth, getAllResto);

export default restoRouter;