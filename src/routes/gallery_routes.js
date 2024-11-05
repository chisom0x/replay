import { Router } from 'express';
import galleryController from '../controller/gallery_controller.js';

const router = Router();

router.post('/', galleryController.addGallery);
router.get('/', galleryController.getAllUserGalleries);
router.get('/:galleryId', galleryController.getGalleryById);
router.get('/details/:galleryId', galleryController.getGalleryDetails);
router.patch('/:galleryId', galleryController.updateGalleryDetails);
router.delete('/:galleryId', galleryController.deleteGallery);

export default router;
