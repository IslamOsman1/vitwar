import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = (buffer, folder = 'alwekala/products') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
      (error, result) => error ? reject(error) : resolve(result)
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
