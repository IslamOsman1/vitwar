import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import { errorHandler, notFound } from './middleware/error.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.get('/ping', (req, res) => res.status(200).type('text/plain').send('OK'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', name: 'Vitwar API' }));

app.use('/api', (req, res, next) => {
  if (req.path === '/health') {
    next();
    return;
  }

  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message: 'Database is not connected yet. Please try again shortly.'
    });
    return;
  }

  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
