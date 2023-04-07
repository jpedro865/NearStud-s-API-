import { Router } from 'express';
import { connect_user, createUser, getAll, getById, logout } from '../controllers/users.controller';
import { auth } from '../middleware/authentificator';

const UserRouter: Router = Router();


UserRouter.get('/', auth, getAll);
UserRouter.get('/:id', auth, getById);
UserRouter.post('/', createUser);
UserRouter.post('/connect', connect_user);
UserRouter.post('/logout', logout);

export default UserRouter;
