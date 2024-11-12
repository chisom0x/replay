import { Router } from 'express';
import statsController from '../controller/stats_controller.js';

const router = Router();

router.all('/', statsController.getStats);

export default router;
