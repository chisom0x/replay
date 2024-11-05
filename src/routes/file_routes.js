import { Router } from 'express';
import fileController from '../controller/files_controller.js';
import upload from '../middlewares/multer.js';

const router = Router();

router.post(
  '/upload/:galleryId',
  upload.array('photo'),
  fileController.uploadFile
);
router.delete('/:fileId', fileController.deleteFile);

export default router;
