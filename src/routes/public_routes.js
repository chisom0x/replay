import { Router } from 'express';
import upload from '../middlewares/multer.js';
import galleryController from '../controller/gallery_controller.js';
import fileController from '../controller/files_controller.js';

const router = Router();

router.get('/gallery/:galleryKey', galleryController.getGalleryDetailsByKey);
router.post(
  '/upload/:galleryId',
  upload.array('photo'),
  fileController.uploadFile
);

export default router;
