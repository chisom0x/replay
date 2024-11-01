import cloudinary from '../config/cloudinary_config.js';
import { Readable } from 'stream';

export const uploadPhotoBufferToCloudinary = async (buffer) => {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'photo_uploads' },
        (error, result) => {
          if (result) {
            resolve(result.secure_url);
          } else {
            reject(error);
          }
        }
      );

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(stream);
    });
  } catch (error) {
    throw new Error(`Photo upload failed: ${error.message}`);
  }
};

export const uploadAudioBufferToCloudinary = async (buffer) => {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'audio_uploads' },
        (error, result) => {
          if (result) {
            resolve(result.secure_url);
          } else {
            reject(error);
          }
        }
      );

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(stream);
    });
  } catch (error) {
    throw new Error(`Audio upload failed: ${error.message}`);
  }
};
