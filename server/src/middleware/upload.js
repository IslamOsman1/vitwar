import multer from 'multer';

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('ارفع صورة فقط'), false);
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 3 * 1024 * 1024 } });
