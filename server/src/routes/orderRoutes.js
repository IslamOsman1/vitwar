import express from 'express';
import { admin, protect } from '../middleware/auth.js';
import { allOrders, createOrder, getOrderById, myOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();
router.post('/', protect, createOrder);
router.get('/my', protect, myOrders);
router.get('/', protect, admin, allOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
export default router;
