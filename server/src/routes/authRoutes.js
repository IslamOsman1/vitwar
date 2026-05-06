import express from 'express';
import { googleLogin, login, profile, register, setManualPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.put('/set-password', protect, setManualPassword);
router.get('/profile', protect, profile);
export default router;
