import fileController from '../../controller/files_controller.js';
import fileService from '../../services/files_service.js';
import { uploadPhotoBufferToCloudinary } from '../../utils/cloudinary_upload.js';
import { successResponse } from '../../utils/response.js';
import AppError from '../../utils/app_error.js';

jest.mock('../../services/files_service.js');
jest.mock('../../utils/cloudinary_upload.js');
jest.mock('../../utils/response.js');

describe('fileController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      files: [],
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should return an error if galleryId is not provided', async () => {
      await fileController.uploadFile(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new AppError('please provide a gallery id!', 400)
      );
    });

    it('should return an error if no files are provided', async () => {
      mockReq.params.galleryId = '1';
      mockReq.files = null || undefined;

      await fileController.uploadFile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new AppError('please provide a file!', 400)
      );
    });

    it('should upload files and add them to the gallery', async () => {
      mockReq.params.galleryId = '1';
      mockReq.files = [
        { buffer: Buffer.from('file1') },
        { buffer: Buffer.from('file2') },
      ];
      uploadPhotoBufferToCloudinary
        .mockResolvedValueOnce('http://example.com/file1')
        .mockResolvedValueOnce('http://example.com/file2');
      fileService.addFile.mockResolvedValue(true);

      await fileController.uploadFile(mockReq, mockRes, mockNext);

      expect(uploadPhotoBufferToCloudinary).toHaveBeenCalledTimes(2);
      expect(fileService.addFile).toHaveBeenCalledWith(
        '1',
        'http://example.com/file1'
      );
      expect(fileService.addFile).toHaveBeenCalledWith(
        '1',
        'http://example.com/file2'
      );
      expect(successResponse).toHaveBeenCalledWith(mockRes, null);
    });

    it('should handle errors and call next', async () => {
      mockReq.params.galleryId = '1';
      mockReq.files = [{ buffer: Buffer.from('file1') }];
      uploadPhotoBufferToCloudinary.mockRejectedValue(
        new Error('Cloudinary Error')
      );

      await fileController.uploadFile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Cloudinary Error'));
    });
  });

  describe('deleteFile', () => {
    it('should return an error if fileId is not provided', async () => {
      await fileController.deleteFile(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new AppError('provide a file id!', 400)
      );
    });

    it('should delete the file and return a success response', async () => {
      mockReq.params.fileId = '1';
      fileService.deleteFile.mockResolvedValue(true);

      await fileController.deleteFile(mockReq, mockRes, mockNext);

      expect(fileService.deleteFile).toHaveBeenCalledWith('1');
      expect(successResponse).toHaveBeenCalledWith(mockRes, null);
    });

    it('should handle errors and call next', async () => {
      mockReq.params.fileId = '1';
      fileService.deleteFile.mockRejectedValue(new Error('File Service Error'));

      await fileController.deleteFile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('File Service Error'));
    });
  });
});
