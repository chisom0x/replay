import AppError from '../utils/app_error.js';
import { successResponse } from '../utils/response.js';
import Authorization from '../middlewares/authorization.js';
import galleryService from '../services/gallery_service.js';

export default class statsController {
  static async getStats(req, res, next) {
    try {
      const userId = await Authorization.loggedInUserId(req, res);
      const galleries = await galleryService.findGalleries(userId);

      let data = {
        totalGalleries: 0,
        totalFiles: 0,
      };

      if (galleries.length !== 0) {
        data.totalGalleries = galleries.length;

        for (const gallery of galleries) {
          data.totalFiles += gallery.fileCount;
        }
      }

      return successResponse(res, data);
    } catch (error) {
      return next(error);
    }
  }
}
