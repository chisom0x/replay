import { Router } from 'express';
import authRouter from './auth_routes.js';
import galleryRouter from './gallery_routes.js';
import fileRouter from './file_routes.js';
import statsRouter from './stats_routes.js';
import userRouter from './user_routes.js';
import Authorization from '../middlewares/authorization.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/gallery', galleryRouter);
router.use('/file',  fileRouter);
router.use('/stats',  statsRouter);
router.use('/user',  userRouter);

export default router;
