import { Router } from 'express';
import { auth } from '../middleware/authentificator';
import { valid_email_token } from '../controllers/tokens.controller';
import { hasRigths } from '../middleware/permissions';
import { createResto, getRestoById, getAllResto } from '../controllers/resto.controllers';

const restoRouter: Router = Router();

restoRouter.post(`/add`, auth, createResto);
restoRouter.get('/:id', auth, getRestoById);
restoRouter.get('/', auth, getAllResto);

export default restoRouter;