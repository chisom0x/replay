import AppError from '../utils/app_error.js';
import { uploadPhotoBufferToCloudinary } from '../utils/cloudinary_upload.js';
import { errorResponse, successResponse } from '../utils/response.js';
import Authorization from '../middlewares/authorization.js';
import galleryService from '../services/gallery_service.js';
import fileService from '../services/files_service.js';
import bcrypt from 'bcryptjs';
import UserService from '../services/user_service.js';

export default class userController {
  static async getUserData(req, res, next) {
    try {
      const userId = await Authorization.loggedInUserId(req, res);
      if (!userId)
        return next(new AppError('logged in user id is invalid!', 400));
      const user = await UserService.findUserById(userId);

      return successResponse(res, {
        photo: user.photo,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateUserData(req, res, next) {
    try {
      const userId = await Authorization.loggedInUserId(req, res);
      const { firstName, lastName, email } = req.body;
      const photo = req.fileService;

      const getPhotoUrl = async (imageField, currentUrl) => {
        if (imageField && imageField.buffer) {
          const uploadedImage = await uploadPhotoBufferToCloudinary(
            imageField.buffer
          );
          return uploadedImage;
        } else if (
          typeof currentUrl === 'string' &&
          currentUrl.includes('res.cloudinary.com')
        ) {
          return currentUrl;
        }
      };

      const user = await UserService.findUserById(userId);

      const photoUrl = await getPhotoUrl(photo, user.photo);

      await UserService.updateUserInfo(
        userId,
        photoUrl,
        firstName,
        lastName,
        email
      );

      return successResponse(res, null);
    } catch (error) {
      return next(error);
    }
  }

  static async updateUserPassword(req, res, next) {
    try {
      const userId = await Authorization.loggedInUserId(req, res);
      console.log(userId)
      const { oldPassword, newPassword } = req.body;
  
      if (!oldPassword) {
        return next(new AppError('Please enter your old password!'));
      }
      if (!newPassword) {
        return next(new AppError('Please enter your new password!'));
      }
  
      // Find user by ID
      const user = await UserService.findUserById(userId);
  
      // Check if the old password matches
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return errorResponse(res, 400, 'Old password is incorrect');
      }

  
      // Save the updated user
      await user.save();
  
      return successResponse(res, 'Password updated successfully');
    } catch (error) {
      return next(error);
    }
  }
  
}
