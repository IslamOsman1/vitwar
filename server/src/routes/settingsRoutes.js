import express from 'express';
import { getAdminSettings, getPublicSettings, updateSettings, uploadBannerImage } from '../controllers/settingsController.js';
import { admin, protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/public', getPublicSettings);
router.get('/admin', protect, admin, getAdminSettings);
router.post('/admin/banner-upload', protect, admin, upload.single('image'), uploadBannerImage);
router.put('/admin', protect, admin, updateSettings);

export default router;
