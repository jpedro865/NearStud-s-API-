import { Router } from 'express';
import { createUser, getAll, getById } from '../controllers/users.controller';

const UserRouter: Router = Router();


UserRouter.get('/', getAll);
UserRouter.get('/:id', getById);
UserRouter.post('/', createUser);

export default UserRouter;
