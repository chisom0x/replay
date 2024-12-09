import AppError from '../utils/app_error.js';
import { uploadPhotoBufferToCloudinary } from '../utils/cloudinary_upload.js';
import genQr from '../utils/qr.js';
import { successResponse } from '../utils/response.js';
import Authorization from '../middlewares/authorization.js';
import galleryService from '../services/gallery_service.js';
import fileService from '../services/files_service.js';
import GalleryValidations from '../validations/gallery_validations.js';

export default class galleryController {
  static async addGallery(req, res, next) {
    try {
      const { error } = GalleryValidations.validateAddGallery(req.body);
      if (error) return next(new AppError(error.details[0].message, 400));

      const userId = await Authorization.loggedInUserId(req, res);
      const { title } = req.body;

      const galleryKey = Array.from(
        { length: 6 },
        () =>
          'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
      ).join('');

      const qrCode = await genQr(
        `https://replay-delta.vercel.app/${galleryKey}`
      );
      if (!qrCode)
        return next(new AppError('failed to generate a QR Code!', 500));

      const qrCodeUrl = await uploadPhotoBufferToCloudinary(qrCode);
      if (!qrCodeUrl)
        return next(new AppError('failed to upload QR Code!', 500));

      await galleryService.createGallery(userId, title, galleryKey, qrCodeUrl);
      return successResponse(res, null);
    } catch (error) {
      return next(error);
    }
  }

  static async getGalleryById(req, res, next) {
    try {
      const { error } = GalleryValidations.validateGalleryId(req.params);
      if (error) return next(new AppError(error.details[0].message, 400));

      const galleryId = req.params.galleryId;
      const gallery = await galleryService.findGallery(galleryId);

      const files = await fileService.findAllFilesByGallery(galleryId);
      const data = {
        title: gallery.title,
        fileCount: gallery.fileCount,
        galleryLink: `https://replay-delta.vercel.app/${gallery.galleryKey}`,
        galleryId: gallery.id,
        files: files.map((file) => ({ link: file.link, fileId: file.id })),
      };

      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  }

  static async getAllUserGalleries(req, res, next) {
    try {
      const userId = await Authorization.loggedInUserId(req, res);
      const galleries = await galleryService.findGalleries(userId);

      const data = galleries.map((gallery) => ({
        title: gallery.title,
        fileCount: `${gallery.fileCount} Files`,
        galleryId: gallery.id,
      }));

      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  }

  static async getGalleryDetails(req, res, next) {
    try {
      const { error } = GalleryValidations.validateGalleryId(req.params);
      if (error) return next(new AppError(error.details[0].message, 400));

      const galleryId = req.params.galleryId;
      const gallery = await galleryService.findGallery(galleryId);

      if (!gallery)
        return next(new AppError('please provide a valid gallery id!', 400));

      const data = {
        title: gallery.title,
        linkActive: gallery.linkActive,
        galleryId: gallery.id,
        qrCode: gallery.qrCode,
      };

      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  }

  static async getGalleryDetailsByKey(req, res, next) {
    try {
      const { error } = GalleryValidations.validateGalleryKey(req.params);
      if (error) return next(new AppError(error.details[0].message, 400));

      const galleryKey = req.params.galleryKey;
      const gallery = await galleryService.findGalleryByUniqueKey(galleryKey);

      const files = await fileService.findAllFilesByGallery(gallery.id);
      const data = {
        linkActive: gallery.linkActive,
        title: gallery.title,
        galleryLink: `https://replay-delta.vercel.app/${gallery.galleryKey}`,
        galleryId: gallery.id,
        files: files.map((file) => ({ link: file.link })),
      };

      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  }

  static async updateGalleryDetails(req, res, next) {
    try {
      const { error } = GalleryValidations.validateUpdateGalleryDetails({
        params: req.params,
        body: req.body,
      });
      if (error) return next(new AppError(error.details[0].message, 400));

      const galleryId = req.params.galleryId;
      const { title, linkActive } = req.body;

      await galleryService.updateGalleryDetails(galleryId, title, linkActive);
      return successResponse(res, null);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteGallery(req, res, next) {
    try {
      const { error } = GalleryValidations.validateGalleryId(req.params);
      if (error) return next(new AppError(error.details[0].message, 400));

      const galleryId = req.params.galleryId;
      await galleryService.deleteGallery(galleryId);

      return successResponse(res, null);
    } catch (error) {
      return next(error);
    }
  }
}
