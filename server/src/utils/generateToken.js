import jwt from 'jsonwebtoken';

export const generateToken = (payload) => jwt.sign(
  typeof payload === 'object' ? payload : { id: payload },
  process.env.JWT_SECRET,
  {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  }
);
