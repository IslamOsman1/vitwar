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

await User.create({ name: 'Vitwar Admin', email: 'admin@vitwar.com', password: '12345678', phone: '01000000000', role: 'admin' });

const products = [
  { name: 'وافل نوتيلا', description: 'وافل طازة مغطاة بالنوتيلا مع طبقة شوكولاتة ناعمة.', price: 110, oldPrice: 125, category: 'وافل', subcategory: 'وافل نوتيلا', unit: 'قطعة', countInStock: 80, featured: true, isDeal: true, inAgencyCollection: true },
  { name: 'وافل لوتس', description: 'وافل ذهبية مع صوص لوتس وبسكويت مطحون ولمسة كراميل.', price: 120, oldPrice: 135, category: 'وافل', subcategory: 'وافل لوتس', unit: 'قطعة', countInStock: 70, featured: true, isDeal: true, inAgencyCollection: true },
  { name: 'براونيز نوتيلا', description: 'قطعة براونيز غنية بقلب شوكولاتة وصوص نوتيلا كثيف.', price: 95, category: 'براونيز', subcategory: 'براونيز نوتيلا', unit: 'قطعة', countInStock: 90, featured: true, inAgencyCollection: true },
  { name: 'براونيز لوتس', description: 'براونيز طرية بطبقة لوتس كريمية وفتات بسكويت مقرمش.', price: 100, oldPrice: 115, category: 'براونيز', subcategory: 'براونيز لوتس', unit: 'قطعة', countInStock: 50, isDeal: true, inAgencyCollection: true },
  { name: 'آيس كريم شوكولاتة', description: 'سكوب آيس كريم غني بالشوكولاتة يقدم مع صوص ولمسة تزيين.', price: 60, oldPrice: 70, category: 'ايس كريم', subcategory: 'آيس كريم', unit: 'كوب', countInStock: 65, featured: true, isDeal: true, inAgencyCollection: true },
  { name: 'ميكس سويت', description: 'تجميعة من وافل وبراونيز وآيس كريم مناسبة للمشاركة.', price: 185, category: 'ايس كريم', subcategory: 'عروض السويت', unit: 'بوكس', countInStock: 40, inAgencyCollection: true },
  { name: 'صوص شوكولاتة إضافي', description: 'إضافة شوكولاتة غنية ترفع الطعم وتكمّل الطلب.', price: 20, category: 'صوصات', subcategory: 'صوصات شوكولاتة', unit: 'علبة', countInStock: 120, inAgencyCollection: true },
  { name: 'مكسرات محمصة', description: 'مكسرات مشكلة تضيف قرمشة ولمسة نهائية للحلا.', price: 25, category: 'صوصات', subcategory: 'مكسرات', unit: 'علبة', countInStock: 150, inAgencyCollection: true }
];
await Product.insertMany(products);
console.log('Seed completed: admin@vitwar.com / 12345678');
process.exit();
