import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

export const isCloudinaryConfigured = () => Boolean(
  process.env.CLOUDINARY_CLOUD_NAME
  && process.env.CLOUDINARY_API_KEY
  && process.env.CLOUDINARY_API_SECRET
);

export const uploadToCloudinary = (buffer, folder = 'elkhawaga/products') => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      const error = new Error('ملف الصورة غير صالح أو لم يتم استلامه بشكل صحيح');
      error.statusCode = 400;
      reject(error);
      return;
    }

    if (!isCloudinaryConfigured()) {
      const error = new Error('إعدادات Cloudinary غير مكتملة على السيرفر. أضف CLOUDINARY_CLOUD_NAME و CLOUDINARY_API_KEY و CLOUDINARY_API_SECRET');
      error.statusCode = 500;
      reject(error);
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
      (error, result) => error ? reject(error) : resolve(result)
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
