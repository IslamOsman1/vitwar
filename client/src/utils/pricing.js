const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export const calculateCheckoutTotals = ({
  itemsPrice = 0,
  shippingPrice = 0,
  settings = null,
  user = null,
  discountCode = '',
  redeemLoyaltyPoints = false
}) => {
  const subtotal = roundMoney(Number(itemsPrice || 0) + Number(shippingPrice || 0));
  const normalizedCode = String(discountCode || '').trim().toUpperCase();

  return {
    discountCode: normalizedCode,
    discountCodeAmount: 0,
    loyaltyPointsUsed: 0,
    loyaltyPointsDiscount: 0,
    totalPrice: roundMoney(subtotal)
  };
};
