import express from 'express';
import { createStripeCheckoutSession, verifyStripeCheckoutSession } from '../controllers/paymentController.js';
import { optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.post('/stripe/checkout-session', optionalProtect, createStripeCheckoutSession);
router.get('/stripe/verify/:sessionId', optionalProtect, verifyStripeCheckoutSession);

export default router;
