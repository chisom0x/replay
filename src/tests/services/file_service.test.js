import FileService from '../../services/files_service.js';
import Files from '../../models/file_model.js';
import Gallery from '../../models/gallery_model.js';

jest.mock('../../models/file_model.js');
jest.mock('../../models/gallery_model.js');

describe('FileService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addFile', () => {
    it('should add a file to a gallery', async () => {
      const mockGallery = {
        id: 1,
        fileCount: 0,
        save: jest.fn().mockResolvedValue(),
      };
      const mockFile = { id: 1, galleryId: 1, link: 'file-link' };

      Gallery.findByPk.mockResolvedValue(mockGallery);
      Files.create.mockResolvedValue(mockFile);

      const result = await FileService.addFile(1, 'file-link');

      expect(Gallery.findByPk).toHaveBeenCalledWith(1);
      expect(Files.create).toHaveBeenCalledWith({
        galleryId: 1,
        link: 'file-link',
      });
      expect(mockGallery.fileCount).toBe(1);
      expect(mockGallery.save).toHaveBeenCalled();
      expect(result).toEqual(mockFile);
    });

    it('should throw an error if the gallery is not found', async () => {
      Gallery.findByPk.mockResolvedValue(null);

      await expect(FileService.addFile(1, 'file-link')).rejects.toThrow(
        'gallery not found!'
      );
    });

    it('should throw an error if file creation fails', async () => {
      const mockGallery = {
        id: 1,
        fileCount: 0,
        save: jest.fn().mockResolvedValue(),
      };

      Gallery.findByPk.mockResolvedValue(mockGallery);
      Files.create.mockRejectedValue(new Error('Create error'));

      await expect(FileService.addFile(1, 'file-link')).rejects.toThrow(
        'Create error'
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file and update the gallery file count', async () => {
      const mockFile = {
        id: 1,
        galleryId: 1,
        destroy: jest.fn().mockResolvedValue(),
      };
      const mockGallery = {
        id: 1,
        fileCount: 1,
        save: jest.fn().mockResolvedValue(),
      };

      Files.findByPk.mockResolvedValue(mockFile);
      Gallery.findByPk.mockResolvedValue(mockGallery);

      const result = await FileService.deleteFile(1);

      expect(Files.findByPk).toHaveBeenCalledWith(1);
      expect(Gallery.findByPk).toHaveBeenCalledWith(1);
      expect(mockGallery.fileCount).toBe(0);
      expect(mockGallery.save).toHaveBeenCalled();
      expect(mockFile.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw an error if the file is not found', async () => {
      Files.findByPk.mockResolvedValue(null);

      await expect(FileService.deleteFile(1)).rejects.toThrow(
        'file not found!'
      );
    });

    it('should throw an error if the gallery is not found', async () => {
      const mockFile = {
        id: 1,
        galleryId: 1,
        destroy: jest.fn().mockResolvedValue(),
      };

      Files.findByPk.mockResolvedValue(mockFile);
      Gallery.findByPk.mockResolvedValue(null);

      await expect(FileService.deleteFile(1)).rejects.toThrow(
        'gallery not found!'
      );
    });
  });

  describe('findAllFilesByGallery', () => {
    it('should return all files for a gallery', async () => {
      const mockFiles = [
        { id: 1, galleryId: 1 },
        { id: 2, galleryId: 1 },
      ];

      Files.findAll.mockResolvedValue(mockFiles);

      const result = await FileService.findAllFilesByGallery(1);

      expect(Files.findAll).toHaveBeenCalledWith({ where: { galleryId: 1 } });
      expect(result).toEqual(mockFiles);
    });

    it('should return an empty array if no files are found', async () => {
      Files.findAll.mockResolvedValue([]);

      const result = await FileService.findAllFilesByGallery(1);

      expect(Files.findAll).toHaveBeenCalledWith({ where: { galleryId: 1 } });
      expect(result).toEqual([]);
    });
  });
});
