import Files from './file_model.js';
import User from './user_model.js';
import Gallery from './gallery_model.js';

// many galleries for one user
Gallery.belongsTo(User, {
  foreignKey: 'userId',
});

// one user to many galleries
User.hasMany(Gallery, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

//  many files to one gallery
Files.belongsTo(Gallery, {
    foreignKey: 'galleryId'
})

// one gallery to many files
Gallery.hasMany(Files, {
    foreignKey: 'galleryId',
    onDelete: 'CASCADE'
})
