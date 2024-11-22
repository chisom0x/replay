import GalleryService from '../../services/gallery_service.js';
import Gallery from '../../models/gallery_model.js';

jest.mock('../../models/gallery_model.js');

describe('GalleryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGallery', () => {
    it('should create a new gallery', async () => {
      const mockGallery = {
        id: 1,
        userId: 1,
        title: 'Test Gallery',
        galleryKey: '123',
        qrCode: 'qr123',
      };

      Gallery.create.mockResolvedValue(mockGallery);

      const result = await GalleryService.createGallery(
        1,
        'Test Gallery',
        '123',
        'qr123'
      );

      expect(Gallery.create).toHaveBeenCalledWith({
        userId: 1,
        title: 'Test Gallery',
        galleryKey: '123',
        qrCode: 'qr123',
      });
      expect(result).toEqual(mockGallery);
    });

    it('should throw an error if create fails', async () => {
      Gallery.create.mockRejectedValue(new Error('Create error'));

      await expect(
        GalleryService.createGallery(1, 'Test Gallery', '123', 'qr123')
      ).rejects.toThrow('Create error');
    });
  });

  describe('findGalleries', () => {
    it('should return galleries for a user', async () => {
      const mockGalleries = [
        { id: 1, userId: 1 },
        { id: 2, userId: 1 },
      ];
      Gallery.findAll.mockResolvedValue(mockGalleries);

      const result = await GalleryService.findGalleries(1);

      expect(Gallery.findAll).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(result).toEqual(mockGalleries);
    });

    it('should return an empty array if no galleries are found', async () => {
      Gallery.findAll.mockResolvedValue([]);

      const result = await GalleryService.findGalleries(1);

      expect(Gallery.findAll).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(result).toEqual([]);
    });
  });

  describe('findGallery', () => {
    it('should return a gallery by ID', async () => {
      const mockGallery = { id: 1, title: 'Test Gallery' };
      Gallery.findByPk.mockResolvedValue(mockGallery);

      const result = await GalleryService.findGallery(1);

      expect(Gallery.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockGallery);
    });

    it('should return null if gallery is not found', async () => {
      Gallery.findByPk.mockResolvedValue(null);

      const result = await GalleryService.findGallery(1);

      expect(Gallery.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });

  describe('updateGalleryDetails', () => {
    it('should update gallery details', async () => {
      const mockGallery = {
        id: 1,
        title: 'Old Title',
        linkActive: false,
        save: jest.fn().mockResolvedValue(),
      };
      Gallery.findByPk.mockResolvedValue(mockGallery);

      const result = await GalleryService.updateGalleryDetails(
        1,
        'New Title',
        true
      );

      expect(Gallery.findByPk).toHaveBeenCalledWith(1);
      expect(mockGallery.title).toBe('New Title');
      expect(mockGallery.linkActive).toBe(true);
      expect(mockGallery.save).toHaveBeenCalled();
      expect(result).toEqual(mockGallery);
    });

    it('should throw an error if gallery is not found', async () => {
      Gallery.findByPk.mockResolvedValue(null);

      await expect(
        GalleryService.updateGalleryDetails(1, 'New Title', true)
      ).rejects.toThrow('Gallery not found!');
    });
  });

  describe('deleteGallery', () => {
    it('should delete a gallery', async () => {
      const mockGallery = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(),
      };
      Gallery.findByPk.mockResolvedValue(mockGallery);

      const result = await GalleryService.deleteGallery(1);

      expect(Gallery.findByPk).toHaveBeenCalledWith(1);
      expect(mockGallery.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw an error if gallery is not found', async () => {
      Gallery.findByPk.mockResolvedValue(null);

      await expect(GalleryService.deleteGallery(1)).rejects.toThrow();
    });
  });
});
