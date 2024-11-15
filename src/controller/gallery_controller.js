import AppError from '../utils/app_error.js';
import { uploadPhotoBufferToCloudinary } from '../utils/cloudinary_upload.js';
import genQr from '../utils/qr.js';
import { successResponse } from '../utils/response.js';
import Authorization from '../middlewares/authorization.js';
import galleryService from '../services/gallery_service.js';
import fileService from '../services/files_service.js';

export default class galleryController {
  static async addGallery(req, res, next) {
    function generateUniqueCode() {
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';

      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
      }

      return result;
    }
    try {
      const userId = await Authorization.loggedInUserId(req, res);
      const { title } = req.body;
      const galleryKey = generateUniqueCode();

      if (!title) return next(new AppError('please provide a title!', 400));
      if (!galleryKey)
        return next(new AppError('failed to generate a galleryKey!', 500));

      const qrCode = await genQr('https://replay-delta.vercel.app/');

      if (!qrCode)
        return next(new AppError('failed to generate a QR Code!', 500));

      const qrCodeUrl = await uploadPhotoBufferToCloudinary(qrCode)

      if (!qrCodeUrl)
        return next(new AppError('failed to upload QR Code!', 500));

      await galleryService.createGallery(userId, title, galleryKey, qrCodeUrl);

      return successResponse(res, null);
    } catch (error) {
      return next(error);
    }
  }
  static async getAllUserGalleries(req, res, next) {
    try {
      const userId = await Authorization.loggedInUserId(req, res);
      const galleries = await galleryService.findGalleries(userId);

      let data = [];

      for (const gallery of galleries) {
        data.push({
          title: gallery.title,
          fileCount: `${gallery.fileCount} Files`,
          galleryId: gallery.id,
        });
      }

      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  }
  static async getGalleryById(req, res, next) {
    try {
      const galleryId = req.params.galleryId;

      if (!galleryId)
        return next(new AppError('please provide a gallery id!', 400));

      const gallery = await galleryService.findGallery(galleryId);

      const files = await fileService.findAllFilesByGallery(galleryId);

      let data = {
        title: gallery.title,
        fileCount: gallery.fileCount,
        galleryLink: `https:www.replay.com/${gallery.galleryKey}/${gallery.title}`,
        galleryId: gallery.id,
        files: [],
      };

      if (!files) {
        return successResponse(res, data);
      }

      for (const file of files) {
        data.files.push({
          link: file.link,
          fileId: file.id,
        });
      }

      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  }
  static async getGalleryDetails(req, res, next) {
    try {
      const galleryId = req.params.galleryId;

      if (!galleryId)
        return next(new AppError('please provide a gallery id!', 400));

      const gallery = await galleryService.findGallery(galleryId);

      if (!gallery)
        return next(new AppError('please provide a valid gallery id!', 400));

      const data = {
        title: gallery.title,
        linkActive: gallery.linkActive,
        galleryId: gallery.id,
        qrCode: gallery.qrCode
      };

      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  }
  static async updateGalleryDetails(req, res, next) {
    try {
      const galleryId = req.params.galleryId;
      const { title, linkActive } = req.body;

      if (!galleryId)
        return next(new AppError('please provide a gallery id!', 400));

      await galleryService.updateGalleryDetails(galleryId, title, linkActive);

      return successResponse(res, null);
    } catch (error) {
      return next(error);
    }
  }
  static async deleteGallery(req, res, next) {
    try {
      const galleryId = req.params.galleryId;

      if (!galleryId)
        return next(new AppError('please provide a gallery id!', 400));

      await galleryService.deleteGallery(galleryId);

      return successResponse(res, null);
    } catch (error) {
      return next(error);
    }
  }
}
