const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export const normalizeAddOns = (addOns = []) => (
  (Array.isArray(addOns) ? addOns : [])
    .filter((item) => item?._id || item?.product)
    .map((item) => ({
      _id: String(item._id || item.product),
      name: String(item.name || '').trim(),
      price: Number(item.price || 0),
      image: String(item.image || '').trim(),
      qty: Math.max(1, Number(item.qty || 1))
    }))
    .sort((a, b) => a._id.localeCompare(b._id))
);

export const getCartItemKey = (productId, addOns = []) => {
  const normalizedAddOns = normalizeAddOns(addOns);
  const addOnKey = normalizedAddOns.map((item) => `${item._id}:${item.qty}`).join('|');
  return addOnKey ? `${productId}::${addOnKey}` : String(productId);
};

export const getItemAddOnsUnitPrice = (item = {}) => (
  roundMoney(normalizeAddOns(item.addOns).reduce((sum, addOn) => sum + Number(addOn.price || 0) * Number(addOn.qty || 1), 0))
);

export const getItemUnitPrice = (item = {}) => (
  roundMoney(Number(item.price || 0) + getItemAddOnsUnitPrice(item))
);

export const getItemLinePrice = (item = {}) => (
  roundMoney(getItemUnitPrice(item) * Number(item.qty || 0))
);
