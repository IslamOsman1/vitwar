export const calculateShippingForGovernorate = (settings, governorateName, itemsPrice) => {
  const fallbackShippingFee = Number(settings?.checkout?.shippingFee ?? 35);
  const freeShippingThreshold = Number(settings?.checkout?.freeShippingThreshold ?? 500);

  if (!itemsPrice || itemsPrice >= freeShippingThreshold) return 0;

  const governorate = (settings?.checkout?.governorates || []).find(
    (item) => String(item.name || '').trim() === String(governorateName || '').trim()
  );

  if (!governorate) return fallbackShippingFee;
  return Number(governorate.shippingFee ?? fallbackShippingFee);
};
