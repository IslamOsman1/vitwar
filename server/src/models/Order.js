import mongoose from 'mongoose';

const orderItemAddOnSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  addOnId: { type: String, default: '' },
  name: String,
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  qty: { type: Number, default: 1 }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  qty: { type: Number, required: true },
  image: String,
  price: { type: Number, required: true },
  addOns: { type: [orderItemAddOnSchema], default: [] }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone: String,
    branch: String,
    governorate: String,
    cafeName: String,
    city: String,
    area: String,
    street: String,
    notes: String
  },
  fulfillmentMethod: { type: String, enum: ['restaurant', 'cafe', 'delivery'], default: 'restaurant' },
  paymentMethod: { type: String, default: 'الدفع عند الاستلام' },
  paymentProvider: { type: String, default: '' },
  paymentSessionId: { type: String, default: '' },
  paymentReference: { type: String, default: '' },
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true, default: 0 },
  discountCode: { type: String, default: '' },
  discountCodeAmount: { type: Number, default: 0 },
  loyaltyPointsUsed: { type: Number, default: 0 },
  loyaltyPointsDiscount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['جديد', 'تم التسليم', 'ملغي'],
    default: 'جديد'
  },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  deliveredAt: Date,
  loyaltyPointsAwarded: { type: Boolean, default: false },
  loyaltyPointsAmount: { type: Number, default: 0 },
  refundedToWallet: { type: Boolean, default: false },
  refundedAmount: { type: Number, default: 0 },
  refundedAt: Date
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
