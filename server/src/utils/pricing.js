import { calculateShippingPrice } from './shipping.js';

const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const normalizeCode = (value = '') => String(value || '').trim().toUpperCase();
const isCodeExpired = (code) => code?.expiresAt && new Date(code.expiresAt).getTime() < Date.now();

const findMatchedDiscountCode = (settings, user, normalizedCode) => {
  if (!normalizedCode) return null;

  const privateCode = (user?.privateDiscountCodes || []).find((item) => normalizeCode(item.code) === normalizedCode);
  if (privateCode) {
    return { source: 'private', code: privateCode };
  }

  const storeCode = (settings?.loyalty?.discountCodes || []).find((item) => normalizeCode(item.code) === normalizedCode);
  if (storeCode) {
    return { source: 'store', code: storeCode };
  }

  return null;
};

export const calculateEarnedLoyaltyPoints = () => 0;

export const calculateOrderPricing = async ({
  settings,
  items,
  shippingAddress,
  discountCode = '',
  redeemLoyaltyPoints = false,
  user = null
}) => {
  const itemsPrice = roundMoney(items.reduce((sum, item) => {
    const addOnsPrice = (item.addOns || []).reduce((addOnSum, addOn) => (
      addOnSum + Number(addOn.price || 0) * Number(addOn.qty || 1)
    ), 0);
    return sum + (Number(item.price || 0) + addOnsPrice) * Number(item.qty || 0);
  }, 0));
  const shippingPrice = roundMoney(await calculateShippingPrice(itemsPrice, shippingAddress));
  const subtotal = roundMoney(itemsPrice + shippingPrice);

  const normalizedCode = normalizeCode(discountCode);
  let appliedDiscountCode = '';
  let discountCodeSource = '';
  let discountCodeAmount = 0;

  if (normalizedCode) {
    const matchedDiscount = findMatchedDiscountCode(settings, user, normalizedCode);
    const matchedCode = matchedDiscount?.code;

    if (!matchedCode || matchedCode.active === false) {
      const error = new Error('كود الخصم غير صالح');
      error.statusCode = 400;
      throw error;
    }

    if (isCodeExpired(matchedCode)) {
      const error = new Error('انتهت صلاحية كود الخصم');
      error.statusCode = 400;
      throw error;
    }

    if (Number(matchedCode.minOrderAmount || 0) > itemsPrice) {
      const error = new Error('الحد الأدنى للطلب لا يسمح باستخدام كود الخصم');
      error.statusCode = 400;
      throw error;
    }

    if (Number(matchedCode.usageLimit || 0) > 0 && Number(matchedCode.usedCount || 0) >= Number(matchedCode.usageLimit || 0)) {
      const error = new Error('تم استهلاك كود الخصم بالكامل');
      error.statusCode = 400;
      throw error;
    }

    discountCodeAmount = matchedCode.type === 'percent'
      ? roundMoney(itemsPrice * (Number(matchedCode.value || 0) / 100))
      : roundMoney(Number(matchedCode.value || 0));

    if (Number(matchedCode.maxDiscount || 0) > 0) {
      discountCodeAmount = Math.min(discountCodeAmount, Number(matchedCode.maxDiscount || 0));
    }

    discountCodeAmount = roundMoney(Math.min(discountCodeAmount, subtotal));
    appliedDiscountCode = matchedCode.code;
    discountCodeSource = matchedDiscount?.source || 'store';
  }

  const loyaltyPointsUsed = 0;
  const loyaltyPointsDiscount = 0;
  const totalPrice = roundMoney(Math.max(0, subtotal - discountCodeAmount));

  return {
    itemsPrice,
    shippingPrice,
    discountCode: appliedDiscountCode,
    discountCodeSource,
    discountCodeAmount,
    loyaltyPointsUsed,
    loyaltyPointsDiscount,
    totalPrice
  };
};

export const incrementDiscountCodeUsage = async ({ settings, user, code, source = 'store' }) => {
  const normalizedCode = normalizeCode(code);
  if (!normalizedCode) return;

  if (source === 'private' && user?.privateDiscountCodes?.length) {
    const target = user.privateDiscountCodes.find((item) => normalizeCode(item.code) === normalizedCode);
    if (!target) return;
    target.usedCount = Number(target.usedCount || 0) + 1;
    await user.save();
    return;
  }

  if (!settings?.loyalty?.discountCodes?.length) return;

  const target = settings.loyalty.discountCodes.find((item) => normalizeCode(item.code) === normalizedCode);
  if (!target) return;

  target.usedCount = Number(target.usedCount || 0) + 1;
  await settings.save();
};
