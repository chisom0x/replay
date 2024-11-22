import Files from '../models/file_model.js';
import Gallery from '../models/gallery_model.js';

export default class fileService {
  static async addFile(galleryId, link) {
    try {
      const gallery = await Gallery.findByPk(galleryId);
      if (!gallery) throw new Error('gallery not found!');

      const newFile = await Files.create({ galleryId, link });
      gallery.fileCount += 1;
      await gallery.save();
      return newFile;
    } catch (error) {
      throw error;
    }
  }

  static async deleteFile(fileId) {
    try {
      const file = await Files.findByPk(fileId);
      if (!file) throw new Error('file not found!');

      const gallery = await Gallery.findByPk(file.galleryId);
      if (!gallery) throw new Error('gallery not found!');

      gallery.fileCount -= 1;
      await gallery.save();
      await file.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async findAllFilesByGallery(galleryId) {
    try {
      const files = await Files.findAll({ where: { galleryId } });
      return files;
    } catch (error) {
      throw error;
    }
  }
}
