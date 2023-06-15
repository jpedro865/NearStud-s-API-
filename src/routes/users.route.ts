import { Router } from 'express';
import { addFields, connect_user, createUser, deleteFields, deleteUser, getAll, getById, logout, resendEmail, updateUser } from '../controllers/users.controller';
import { auth } from '../middleware/authentificator';
import { valid_email_token } from '../controllers/tokens.controller';
import { hasRigths } from '../middleware/permissions';

const UserRouter: Router = Router();

UserRouter.get('/verif-email/:token', valid_email_token);
UserRouter.get('/', auth, getAll);
UserRouter.get('/:id', auth, hasRigths, getById);
UserRouter.post('/register', createUser);
UserRouter.post('/connect', connect_user);
UserRouter.post('/logout', logout);
UserRouter.post('/resend-email', resendEmail);
UserRouter.delete('/:id', auth, hasRigths, deleteUser);
UserRouter.patch('/:id', auth, hasRigths, updateUser);
UserRouter.post('/add-fields', auth, hasRigths, addFields);
UserRouter.post('/delete-fields', auth, hasRigths, deleteFields);

export default UserRouter;
