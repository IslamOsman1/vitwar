import { ensureStoreSettings } from './storeSettings.js';

const findGovernorateShippingFee = (settings, governorateName) => {
  const normalizedGovernorate = String(governorateName || '').trim();
  if (!normalizedGovernorate) return null;

  const governorate = (settings.checkout?.governorates || []).find(
    (item) => String(item.name || '').trim() === normalizedGovernorate
  );

  if (!governorate) return null;
  return Number(governorate.shippingFee ?? settings.checkout?.shippingFee ?? 35);
};

export const calculateShippingPrice = async (itemsPrice, shippingAddress = {}) => {
  const settings = await ensureStoreSettings();
  const shippingFee = Number(settings.checkout?.shippingFee ?? 35);
  const freeShippingThreshold = Number(settings.checkout?.freeShippingThreshold ?? 500);

  if (!itemsPrice || itemsPrice >= freeShippingThreshold) return 0;

  const governorateFee = findGovernorateShippingFee(settings, shippingAddress.city);
  return governorateFee ?? shippingFee;
};
