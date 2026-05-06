import express from 'express';
import {
  checkPhoneVerification,
  googleLogin,
  login,
  loginWithPhoneCode,
  profile,
  register,
  resetPasswordWithPhone,
  sendPhoneVerification,
  setManualPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/login/phone', loginWithPhoneCode);
router.post('/google', googleLogin);
router.post('/phone/send-code', sendPhoneVerification);
router.post('/phone/verify-code', checkPhoneVerification);
router.post('/reset-password/phone', resetPasswordWithPhone);
router.put('/set-password', protect, setManualPassword);
router.get('/profile', protect, profile);
export default router;
