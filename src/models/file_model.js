import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/config.js';

class Files extends Model {}

Files.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    galleryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING(128),
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
    tableName: 'files',
    timestamps: true,
  }
);

export default Files;
