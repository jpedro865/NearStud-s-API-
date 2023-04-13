import { Router } from 'express';
import { connect_user, createUser, getAll, getById, logout } from '../controllers/users.controller';
import { auth } from '../middleware/authentificator';
import { valid_email_token } from '../controllers/tokens.controller';

const UserRouter: Router = Router();

UserRouter.get('/verif-email/:token', valid_email_token);
UserRouter.get('/', auth, getAll);
UserRouter.get('/:id', auth, getById);
UserRouter.post('/register', createUser);
UserRouter.post('/connect', connect_user);
UserRouter.post('/logout', logout);

export default UserRouter;
