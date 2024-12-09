import AppError from '../utils/app_error.js';
import { uploadPhotoBufferToCloudinary } from '../utils/cloudinary_upload.js';
import { successResponse } from '../utils/response.js';
import fileService from '../services/files_service.js';
import FileValidations from '../validations/file_validations.js';

export default class fileController {
  static async uploadFile(req, res, next) {
    try {
      const { galleryId } = req.params;
      const files = req.files;

      const { error } = FileValidations.uploadFileValidation({ galleryId, files });
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }

      for (const file of files) {
        const fileUrl = await uploadPhotoBufferToCloudinary(file.buffer);
        await fileService.addFile(galleryId, fileUrl);
      }

      const allFiles = await fileService.findAllFilesByGallery(galleryId);

      let fileResponse = [];
      for (const file of allFiles) {
        fileResponse.push({
          link: file.link,
          fileId: file.id,
        });
      }

      return successResponse(res, fileResponse);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteFile(req, res, next) {
    try {
      const { fileId } = req.params;

      const { error } = FileValidations.deleteFileValidation({ fileId });
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }

      await fileService.deleteFile(fileId);

      return successResponse(res, null);
    } catch (error) {
      return next(error);
    }
  }
}
