import { Router } from 'express';
import  authorize  from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';

import { signUp, signIn, signOut } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-up', authorize, requireAdmin, signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signOut);

export default authRouter;