import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/config.js';

class Gallery extends Model {}

Gallery.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    qrCode: {
      type: DataTypes.STRING,
      defaultValue: 'qr_link',
      allowNull: false,
    },
    galleryKey: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    fileCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    linkActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'galleries',
    timestamps: true,
  }
);

export default Gallery;
