import { Router } from 'express';
import upload from '../middlewares/multer.js';
import userController from '../controller/user_controller.js';

const router = Router();

router.get('/', userController.getUserData);
router.patch('/',  upload.single('photo') ,userController.updateUserData)
router.patch('/change-password', userController.updateUserPassword)

export default router;
