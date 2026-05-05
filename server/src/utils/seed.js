import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
await Order.deleteMany();
await Product.deleteMany();
await User.deleteMany();

await User.create({ name: 'Admin', email: 'admin@alwekala.com', password: '12345678', phone: '01000000000', role: 'admin' });

const products = [
  { name: 'طماطم بلدي', description: 'طماطم طازجة مختارة يومياً.', price: 18, oldPrice: 22, category: 'خضار', unit: 'كيلو', countInStock: 80, featured: true, isDeal: true },
  { name: 'موز مستورد', description: 'موز عالي الجودة بطعم سكري.', price: 55, oldPrice: 65, category: 'فاكهة', unit: 'كيلو', countInStock: 60, featured: true, isDeal: true },
  { name: 'لبن كامل الدسم', description: 'لبن طازج مناسب لكل العائلة.', price: 38, category: 'ألبان', unit: 'لتر', countInStock: 100, featured: true },
  { name: 'أرز مصري', description: 'أرز أبيض فاخر.', price: 32, oldPrice: 36, category: 'بقالة', unit: 'كيلو', countInStock: 120, isDeal: true },
  { name: 'زيت عباد الشمس', description: 'زيت نقي للطبخ والقلي.', price: 95, category: 'بقالة', unit: 'عبوة', countInStock: 45 },
  { name: 'جبنة بيضاء', description: 'جبنة طازجة بطعم غني.', price: 68, category: 'ألبان', unit: 'نصف كيلو', countInStock: 50 },
  { name: 'تفاح أحمر', description: 'تفاح أحمر مقرمش.', price: 85, category: 'فاكهة', unit: 'كيلو', countInStock: 70, featured: true },
  { name: 'خيار', description: 'خيار طازج للسلطة.', price: 16, category: 'خضار', unit: 'كيلو', countInStock: 90 }
];
await Product.insertMany(products);
console.log('Seed completed: admin@alwekala.com / 12345678');
process.exit();
