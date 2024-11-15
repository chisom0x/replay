import Gallery from '../models/gallery_model.js';

export default class galleryService {
  static async createGallery(userId, title, galleryKey, qrCode) {
    try {
      const newGallery = await Gallery.create({
        userId: userId,
        title: title,
        galleryKey: galleryKey,
        qrCode: qrCode
      });
      return newGallery;
    } catch (error) {
      throw error;
    }
  }

  static async findGalleries(userId) {
    try {
      const galleries = await Gallery.findAll({
        where: {
          userId: userId,
        },
      });
      return galleries;
    } catch (error) {
      throw error;
    }
  }

  static async findGallery(galleryId) {
    try {
      const gallery = await Gallery.findByPk(galleryId);
      return gallery;
    } catch (error) {
      throw error;
    }
  }

  static async updateGalleryDetails(galleryId,  title, linkActive ) {
    try {
      const gallery = await Gallery.findByPk(galleryId);

      if (!gallery) {
        throw new Error('Gallery not found!');
      }

      if (title !== undefined) gallery.title = title;
      if (linkActive !== undefined) gallery.linkActive = linkActive;

      await gallery.save();
      return gallery;
    } catch (error) {
      throw error;
    }
  }

  static async deleteGallery(galleryId) {
    try {
      const gallery = await Gallery.findByPk(galleryId);

      if (!gallery || gallery === 0) {
        return new Error('gallery not found!');
      }

      await gallery.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}
