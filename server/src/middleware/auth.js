import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) token = header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'غير مصرّح، سجل الدخول أولًا' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.admin) {
      req.user = {
        _id: decoded.id || '000000000000000000000000',
        name: decoded.name || decoded.username || 'Admin',
        email: decoded.email || decoded.username || '',
        role: 'admin',
        permissions: ['*'],
        hasManualPassword: true,
        isEnvAdmin: true
      };
      next();
      return;
    }

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'المستخدم غير موجود' });
    next();
  } catch (error) {
    res.status(401).json({ message: 'انتهت الجلسة أو التوكن غير صحيح' });
  }
});

export const optionalProtect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    req.user = null;
    next();
    return;
  }

  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);

    if (decoded?.admin) {
      req.user = {
        _id: decoded.id || '000000000000000000000000',
        name: decoded.name || decoded.username || 'Admin',
        email: decoded.email || decoded.username || '',
        role: 'admin',
        permissions: ['*'],
        hasManualPassword: true,
        isEnvAdmin: true
      };
      next();
      return;
    }

    const user = await User.findById(decoded.id).select('-password');
    req.user = user || null;
    next();
  } catch {
    req.user = null;
    next();
  }
});

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'هذه الصفحة للأدمن فقط' });
};

export const hasPermission = (permission) => (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  const requiredPermissions = Array.isArray(permission) ? permission : [permission];
  if (
    req.user?.role === 'employee'
    && requiredPermissions.some((item) => req.user.permissions?.includes(item))
  ) return next();
  res.status(403).json({ message: 'غير مصرّح بهذه العملية' });
};
