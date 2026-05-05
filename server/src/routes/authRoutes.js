import express from 'express';
import { facebookLogin, googleLogin, login, profile, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);
router.get('/profile', protect, profile);
export default router;
