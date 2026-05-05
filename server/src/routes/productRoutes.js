import express from 'express';
import { admin, protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createProduct, deleteProduct, getCategories, getProduct, getProducts, updateProduct } from '../controllers/productController.js';

const router = express.Router();
router.get('/', getProducts);
router.get('/categories/list', getCategories);
router.get('/:id', getProduct);
router.post('/', protect, admin, upload.single('image'), createProduct);
router.put('/:id', protect, admin, upload.single('image'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
export default router;
