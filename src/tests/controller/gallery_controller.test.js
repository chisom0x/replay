import galleryController from '../../controller/gallery_controller.js';
import galleryService from '../../services/gallery_service.js';
import fileService from '../../services/files_service.js';
import { successResponse } from '../../utils/response.js';
import { uploadPhotoBufferToCloudinary } from '../../utils/cloudinary_upload.js';
import genQr from '../../utils/qr.js';
import Authorization from '../../middlewares/authorization.js';
import AppError from '../../utils/app_error.js';

jest.mock('../../services/gallery_service.js');
jest.mock('../../services/files_service.js');
jest.mock('../../utils/cloudinary_upload.js');
jest.mock('../../utils/qr.js');
jest.mock('../../middlewares/authorization.js');

describe('galleryController Tests', () => {
  const mockReq = {};
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const mockNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addGallery', () => {
    it('should create a gallery successfully when provided valid data', async () => {
      mockReq.body = { title: 'New Gallery' };
      mockReq.params = { galleryId: '1' };

      jest.spyOn(Authorization, 'loggedInUserId').mockResolvedValue('user123');
      genQr.mockResolvedValue(Buffer.from('QR CODE'));

      uploadPhotoBufferToCloudinary.mockResolvedValue('tet-cloud-url');

      jest.spyOn(galleryService, 'createGallery').mockResolvedValue(true);

      await galleryController.addGallery(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return an error if no title is provided', async () => {
      mockReq.body = {};
      mockReq.params = { galleryId: '1' };

      await galleryController.addGallery(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new AppError('please provide a title!', 400)
      );
    });
  });

  describe('getAllUserGalleries', () => {
    it('should return all galleries for the logged-in user', async () => {
      mockReq.params = { galleryId: '1' };
      jest.spyOn(Authorization, 'loggedInUserId').mockResolvedValue('user123');
      jest
        .spyOn(galleryService, 'findGalleries')
        .mockResolvedValue([
          { title: 'Gallery 1', fileCount: 3, id: 'gallery1' },
        ]);

      await galleryController.getAllUserGalleries(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: true,
        data: [
          { title: 'Gallery 1', fileCount: '3 Files', galleryId: 'gallery1' },
        ],
        message: 'Successful',
      });
    });

    it('should handle case where no galleries exist for the user', async () => {
      jest.spyOn(Authorization, 'loggedInUserId').mockResolvedValue('user123');
      jest.spyOn(galleryService, 'findGalleries').mockResolvedValue([]);

      await galleryController.getAllUserGalleries(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: true,
        data: [],
        message: 'Successful',
      });
    });
  });

  describe('getGalleryById', () => {
    it('should return the gallery details with files', async () => {
      mockReq.params = { galleryId: 'gallery123' };

      jest.spyOn(galleryService, 'findGallery').mockResolvedValue({
        id: 'gallery123',
        title: 'Gallery 1',
        fileCount: 5,
        galleryKey: 'ABC123',
      });
      jest
        .spyOn(fileService, 'findAllFilesByGallery')
        .mockResolvedValue([{ link: 'file1.jpg', id: 'file1' }]);

      await galleryController.getGalleryById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: true,
        message: 'Successful',
        data: {
          title: 'Gallery 1',
          fileCount: 5,
          galleryLink: 'https://replay-delta.vercel.app/ABC123',
          galleryId: 'gallery123',
          files: [{ link: 'file1.jpg', fileId: 'file1' }],
        },
      });
    });

    it('should return an error if no gallery ID is provided', async () => {
      mockReq.params = {};

      await galleryController.getGalleryById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new AppError('please provide a gallery id!', 400)
      );
    });
  });

  describe('deleteGallery', () => {
    it('should delete a gallery successfully', async () => {
      mockReq.params = { galleryId: 'gallery123' };

      jest.spyOn(galleryService, 'deleteGallery').mockResolvedValue(true);

      await galleryController.deleteGallery(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: null,
        message: 'Successful',
        status: true,
      });
    });

    it('should return an error if no gallery ID is provided', async () => {
      mockReq.params = {};

      await galleryController.deleteGallery(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new AppError('please provide a gallery id!', 400)
      );
    });
  });
});
