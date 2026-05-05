import express from 'express';
import { createStripeCheckoutSession, verifyStripeCheckoutSession } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/stripe/checkout-session', protect, createStripeCheckoutSession);
router.get('/stripe/verify/:sessionId', protect, verifyStripeCheckoutSession);

export default router;
