import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/email.js';

const googleClient = new OAuth2Client();

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  addresses: Array.isArray(user.addresses) ? user.addresses : [],
  role: user.role,
  permissions: user.permissions || [],
  avatar: user.avatar || '',
  walletBalance: Number(user.walletBalance || 0),
  hasManualPassword: Boolean(user.hasManualPassword)
});

const buildAuthResponse = (user) => ({
  token: generateToken(user._id),
  user: serializeUser(user)
});

const randomPassword = () => crypto.randomBytes(24).toString('hex');

const normalizePhone = (phone = '') => String(phone || '').trim();

const buildResetCode = () => String(Math.floor(100000 + Math.random() * 900000));

const hashResetCode = (code) => crypto.createHash('sha256').update(String(code)).digest('hex');

const passwordTooShortMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const phone = normalizePhone(req.body.phone);
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ message: 'أدخل البريد الإلكتروني' });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    if (existingUser.googleId && !existingUser.hasManualPassword) {
      existingUser.name = name || existingUser.name;
      existingUser.password = password;
      existingUser.phone = phone;
      existingUser.hasManualPassword = true;
      await existingUser.save();
      return res.status(200).json(buildAuthResponse(existingUser));
    }

    return res.status(400).json({ message: 'البريد مستخدم من قبل' });
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    phone,
    hasManualPassword: true
  });

  res.status(201).json(buildAuthResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (user && await user.matchPassword(password)) {
    return res.json(buildAuthResponse(user));
  }

  if (user?.googleId && !user.hasManualPassword) {
    return res.status(401).json({
      message: 'هذا الحساب مسجل عبر Google فقط. استخدم Google أو أنشئ كلمة مرور بنفس البريد لربط الحساب.'
    });
  }

  res.status(401).json({ message: 'البريد أو كلمة المرور غير صحيحة' });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: 'بيانات Google غير موجودة' });
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    return res.status(400).json({ message: 'تسجيل الدخول بجوجل غير مفعل من إعدادات البيئة' });
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: googleClientId
  });

  const payload = ticket.getPayload();
  if (!payload?.email || !payload.email_verified) {
    return res.status(400).json({ message: 'تعذر التحقق من حساب Google' });
  }

  const normalizedEmail = String(payload.email).trim().toLowerCase();

  let user = await User.findOne({
    $or: [
      { email: normalizedEmail },
      { googleId: payload.sub }
    ]
  });

  if (!user) {
    user = await User.create({
      name: payload.name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      password: randomPassword(),
      hasManualPassword: false,
      phone: '',
      googleId: payload.sub,
      avatar: payload.picture || ''
    });
  } else {
    if (!user.googleId) user.googleId = payload.sub;
    if (!user.avatar && payload.picture) user.avatar = payload.picture;
    if (!user.name && payload.name) user.name = payload.name;
    await user.save();
  }

  res.json(buildAuthResponse(user));
});

export const setManualPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password || String(password).trim().length < 6) {
    return res.status(400).json({ message: passwordTooShortMessage });
  }

  req.user.password = password;
  req.user.hasManualPassword = true;
  await req.user.save();

  res.json(buildAuthResponse(req.user));
});

export const sendResetPasswordCode = asyncHandler(async (req, res) => {
  const normalizedEmail = String(req.body.email || '').trim().toLowerCase();
  if (!normalizedEmail) {
    return res.status(400).json({ message: 'أدخل البريد الإلكتروني' });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(404).json({ message: 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني' });
  }

  const code = buildResetCode();
  user.resetPasswordCodeHash = hashResetCode(code);
  user.resetPasswordCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: 'كود استرجاع كلمة المرور - Al Wekala',
    text: `كود استرجاع كلمة المرور هو: ${code}. صالح لمدة 15 دقيقة.`,
    html: `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>استرجاع كلمة المرور</h2>
        <p>استخدم الكود التالي لإعادة تعيين كلمة المرور:</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 16px 0;">${code}</div>
        <p>صلاحية الكود 15 دقيقة.</p>
      </div>
    `
  });

  res.json({ success: true, message: 'تم إرسال كود التحقق إلى البريد الإلكتروني' });
});

export const resetPasswordWithEmailCode = asyncHandler(async (req, res) => {
  const normalizedEmail = String(req.body.email || '').trim().toLowerCase();
  const code = String(req.body.code || '').trim();
  const password = String(req.body.password || '');

  if (!normalizedEmail) {
    return res.status(400).json({ message: 'أدخل البريد الإلكتروني' });
  }

  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ message: 'كود التحقق يجب أن يكون 6 أرقام' });
  }

  if (!password || password.trim().length < 6) {
    return res.status(400).json({ message: passwordTooShortMessage });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(404).json({ message: 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني' });
  }

  if (!user.resetPasswordCodeHash || !user.resetPasswordCodeExpires) {
    return res.status(400).json({ message: 'اطلب كودًا جديدًا أولًا' });
  }

  if (user.resetPasswordCodeExpires.getTime() < Date.now()) {
    user.resetPasswordCodeHash = '';
    user.resetPasswordCodeExpires = null;
    await user.save();
    return res.status(400).json({ message: 'انتهت صلاحية الكود، اطلب كودًا جديدًا' });
  }

  if (user.resetPasswordCodeHash !== hashResetCode(code)) {
    return res.status(400).json({ message: 'كود التحقق غير صحيح' });
  }

  user.password = password;
  user.hasManualPassword = true;
  user.resetPasswordCodeHash = '';
  user.resetPasswordCodeExpires = null;
  await user.save();

  res.json({ success: true, message: 'تم تحديث كلمة المرور بنجاح' });
});

export const profile = asyncHandler(async (req, res) => res.json(serializeUser(req.user)));
