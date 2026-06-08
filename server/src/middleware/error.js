export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors || {})
      .map((entry) => entry.message)
      .filter(Boolean)
      .join(' - ') || 'بيانات المنتج غير مكتملة أو غير صحيحة';
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'يوجد حقل بصيغة غير صحيحة في البيانات المرسلة';
  }

  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE'
      ? 'حجم الصورة كبير. الحد الأقصى 3 ميجابايت'
      : 'تعذر رفع الصورة المرفقة';
  }

  console.error(`[${req.method} ${req.originalUrl}]`, message);
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
