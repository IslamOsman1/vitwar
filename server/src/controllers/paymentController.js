import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import { ensureStoreSettings } from '../utils/storeSettings.js';

const getStripeClient = async () => {
  const settings = await ensureStoreSettings();
  const secretKey = settings.payment?.stripeSecretKey || process.env.STRIPE_SECRET_KEY;

  if (!settings.payment?.onlinePaymentEnabled) {
    const error = new Error('الدفع الأونلاين غير مفعل حاليًا');
    error.statusCode = 400;
    throw error;
  }

  if (!secretKey) {
    const error = new Error('مفتاح Stripe السري غير موجود في الإعدادات');
    error.statusCode = 400;
    throw error;
  }

  return {
    stripe: new Stripe(secretKey),
    settings
  };
};

export const createStripeCheckoutSession = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId).populate('user', 'email');
  if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

  const isOwner = order.user?._id?.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح بهذه العملية' });
  }

  if (order.isPaid) {
    return res.status(400).json({ message: 'تم دفع هذا الطلب بالفعل' });
  }

  const { stripe, settings } = await getStripeClient();
  const origin = process.env.CLIENT_URL || req.headers.origin || 'http://localhost:5173';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
    cancel_url: `${origin}/checkout/review?order=${order._id}`,
    customer_email: order.user?.email || req.user.email,
    client_reference_id: order._id.toString(),
    metadata: {
      orderId: order._id.toString()
    },
    line_items: order.orderItems.map((item) => ({
      quantity: item.qty,
      price_data: {
        currency: settings.payment?.currency || 'egp',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.name
        }
      }
    })).concat(order.shippingPrice ? [{
      quantity: 1,
      price_data: {
        currency: settings.payment?.currency || 'egp',
        unit_amount: Math.round(order.shippingPrice * 100),
        product_data: {
          name: 'رسوم الشحن'
        }
      }
    }] : [])
  });

  order.paymentProvider = 'stripe';
  order.paymentSessionId = session.id;
  await order.save();

  res.json({ url: session.url, sessionId: session.id });
});

export const verifyStripeCheckoutSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const orderId = req.query.orderId;

  const { stripe } = await getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const targetOrderId = orderId || session.metadata?.orderId || session.client_reference_id;
  const order = await Order.findById(targetOrderId);

  if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });

  const isOwner = order.user?.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح بهذه العملية' });
  }

  if (session.payment_status === 'paid') {
    order.isPaid = true;
    order.paidAt = order.paidAt || new Date();
    order.paymentProvider = 'stripe';
    order.paymentSessionId = session.id;
    order.paymentReference = session.payment_intent?.toString() || session.id;
    await order.save();
  }

  res.json({
    paid: order.isPaid,
    order
  });
});
