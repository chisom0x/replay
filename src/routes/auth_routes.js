import { Router } from 'express';
import Authentication from '../controller/auth_controller.js';
import upload from '../middlewares/multer.js';

const router = Router();

router.post('/signup', upload.single('photo'), Authentication.signUp);
router.post('/login', Authentication.login)

export default router;
