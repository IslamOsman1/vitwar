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

await User.create({ name: 'Admin', email: 'admin@burgerelkhawaga.com', password: '12345678', phone: '01000000000', role: 'admin' });

const products = [
  { name: 'سمـاش برجر', description: 'قطعتان لحم مشويتان مع جبنة وصوص الخواجة.', price: 165, oldPrice: 190, category: 'برجر', subcategory: 'سمـاش برجر', unit: 'ساندوتش', countInStock: 80, featured: true, isDeal: true, inAgencyCollection: true },
  { name: 'دبل تشيز برجر', description: 'لحم دبل، جبنة مضاعفة، وخبز محمص.', price: 210, oldPrice: 235, category: 'برجر', subcategory: 'دبل برجر', unit: 'ساندوتش', countInStock: 70, featured: true, isDeal: true, inAgencyCollection: true },
  { name: 'كريسبي تشيكن ساندوتش', description: 'صدر دجاج مقرمش وخس وصوص رانش.', price: 150, category: 'فرايد تشيكن', subcategory: 'ساندوتش دجاج', unit: 'ساندوتش', countInStock: 90, featured: true, inAgencyCollection: true },
  { name: 'بوكس فرايد تشيكن 6 قطع', description: 'ست قطع دجاج مقرمشة مع بطاطس وصوص.', price: 260, oldPrice: 290, category: 'فرايد تشيكن', subcategory: 'بوكسات مشاركة', unit: 'بوكس', countInStock: 50, isDeal: true, inAgencyCollection: true },
  { name: 'كومبو الخواجة', description: 'سمـاش برجر مع بطاطس ومشروب.', price: 220, oldPrice: 245, category: 'كومبو', subcategory: 'وجبات فردية', unit: 'وجبة', countInStock: 65, featured: true, isDeal: true, inAgencyCollection: true },
  { name: 'كومبو دبل', description: 'دبل برجر مع بطاطس ومشروب كبير.', price: 275, category: 'كومبو', subcategory: 'وجبات دبل', unit: 'وجبة', countInStock: 40, inAgencyCollection: true },
  { name: 'بطاطس محمرة', description: 'بطاطس ذهبية مقرمشة.', price: 55, category: 'مقبلات', subcategory: 'بطاطس', unit: 'علبة', countInStock: 120, inAgencyCollection: true },
  { name: 'صوص الخواجة', description: 'صوص خاص مناسب للبرجر والفرايد تشيكن.', price: 20, category: 'مقبلات', subcategory: 'صوصات', unit: 'علبة', countInStock: 150, inAgencyCollection: true }
];
await Product.insertMany(products);
console.log('Seed completed: admin@burgerelkhawaga.com / 12345678');
process.exit();
