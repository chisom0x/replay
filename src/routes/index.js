import { Router } from 'express';
import authRouter from './auth_routes.js';

const router = Router();

router.use('/auth', authRouter);

export default router;
