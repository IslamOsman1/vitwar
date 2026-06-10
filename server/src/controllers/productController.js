import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import { assertDeletePassword } from '../utils/deleteProtection.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

const escapeRegex = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const generateProductBarcode = () => `PRD-${Date.now().toString(36).toUpperCase()}`;

const parseAvailableAddOns = (value) => {
  let entries = [];

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      entries = Array.isArray(parsed) ? parsed : [];
    } catch {
      entries = [];
    }
  } else if (Array.isArray(value)) {
    entries = value;
  }

  return entries
    .map((item) => {
      const addOn = {
        name: String(item?.name || '').trim(),
        price: Number(item?.price || 0),
        image: String(item?.image || '').trim(),
        active: item?.active !== false
      };
      if (item?._id) addOn._id = item._id;
      return addOn;
    })
    .filter((item) => item.name && Number.isFinite(item.price) && item.price >= 0);
};

export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const keyword = req.query.keyword
    ? {
      $or: [
        { name: { $regex: escapeRegex(req.query.keyword), $options: 'i' } },
        { description: { $regex: escapeRegex(req.query.keyword), $options: 'i' } },
        { category: { $regex: escapeRegex(req.query.keyword), $options: 'i' } },
        { subcategory: { $regex: escapeRegex(req.query.keyword), $options: 'i' } },
        { barcode: { $regex: escapeRegex(req.query.keyword), $options: 'i' } }
      ]
    }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};
  const subcategory = req.query.subcategory ? { subcategory: req.query.subcategory } : {};
  const isDeal = req.query.deals === 'true' ? { isDeal: true } : {};
  const inAgencyCollection = req.query.agency === 'true' || req.query.picks === 'true'
    ? { inAgencyCollection: true }
    : {};
  const query = { ...keyword, ...category, ...subcategory, ...isDeal, ...inAgencyCollection };
  const count = await Product.countDocuments(query);
  const products = await Product.find(query).sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
  res.json({ products, page, pages: Math.ceil(count / limit), count });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('reviews.user', 'name avatar');
  if (!product) return res.status(404).json({ message: 'Ø§Ù„Ù…Ù†ØªØ¬ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' });
  res.json(product);
});

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

export const createProduct = asyncHandler(async (req, res) => {
  const hasCountInStock = String(req.body.countInStock ?? '').trim() !== '';
  const data = {
    ...req.body,
    price: Number(req.body.price || 0),
    oldPrice: Number(req.body.oldPrice || 0),
    countInStock: hasCountInStock ? Number(req.body.countInStock) : null,
    barcode: String(req.body.barcode || '').trim() || generateProductBarcode(),
    measurementValue: Number(req.body.measurementValue || 0),
    measurementUnit: String(req.body.measurementUnit || '').trim(),
    inAgencyCollection: req.body.inAgencyCollection ?? req.body.featured ?? false,
    availableAddOns: parseAvailableAddOns(req.body.availableAddOns)
  };

  let image = { url: '', publicId: '' };
  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.buffer);
      image = { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      error.message = error.message || 'ØªØ¹Ø°Ø± Ø±ÙØ¹ ØµÙˆØ±Ø© Ø§Ù„Ù…Ù†ØªØ¬';
      throw error;
    }
  }

  const product = await Product.create({ ...data, image });
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Ø§Ù„Ù…Ù†ØªØ¬ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' });
  const hasCountInStock = String(req.body.countInStock ?? '').trim() !== '';

  const availableAddOns = parseAvailableAddOns(req.body.availableAddOns);

  Object.assign(product, {
    ...req.body,
    price: Number(req.body.price || 0),
    oldPrice: Number(req.body.oldPrice || 0),
    countInStock: hasCountInStock ? Number(req.body.countInStock) : null,
    barcode: String(req.body.barcode || '').trim(),
    measurementValue: Number(req.body.measurementValue || 0),
    measurementUnit: String(req.body.measurementUnit || '').trim(),
    inAgencyCollection: req.body.inAgencyCollection ?? req.body.featured ?? product.inAgencyCollection,
    availableAddOns
  });

  if (req.file) {
    if (product.image?.publicId) await cloudinary.uploader.destroy(product.image.publicId);
    try {
      const result = await uploadToCloudinary(req.file.buffer);
      product.image = { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      error.message = error.message || 'ØªØ¹Ø°Ø± Ø±ÙØ¹ ØµÙˆØ±Ø© Ø§Ù„Ù…Ù†ØªØ¬';
      throw error;
    }
  }

  await product.save();
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await assertDeletePassword(req.body?.deletePassword);

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Ø§Ù„Ù…Ù†ØªØ¬ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' });

  if (product.image?.publicId) {
    await cloudinary.uploader.destroy(product.image.publicId);
  }

  await product.deleteOne();
  res.json({ message: 'ØªÙ… Ø­Ø°Ù Ø§Ù„Ù…Ù†ØªØ¬' });
});



