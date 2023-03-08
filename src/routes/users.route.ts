import { Router } from 'express';
import { getAll, getById } from '../controllers/users.controller';

const UserRouter: Router = Router();


UserRouter.get('/', getAll);
UserRouter.get('/:id', getById);

export default UserRouter;
