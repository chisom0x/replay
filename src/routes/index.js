import { Router } from 'express';
import authRouter from './auth_routes.js';
import galleryRouter from './gallery_routes.js';
import fileRouter from './file_routes.js';
import statsRouter from './stats_routes.js'
import Authorization from '../middlewares/authorization.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/gallery', Authorization.verifyToken, galleryRouter);
router.use('/file',  Authorization.verifyToken, fileRouter);
router.use('/stats', Authorization.verifyToken, statsRouter)

export default router;
