import express from 'express';
import {
  adminLogin,
  googleLogin,
  login,
  profile,
  register,
  resetPasswordWithEmailCode,
  sendResetPasswordCode,
  setManualPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/google', googleLogin);
router.post('/reset-password/email/send-code', sendResetPasswordCode);
router.post('/reset-password/email/confirm', resetPasswordWithEmailCode);
router.put('/set-password', protect, setManualPassword);
router.get('/profile', protect, profile);

export default router;
