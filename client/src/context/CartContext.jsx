import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getCartItemKey, getItemLinePrice, normalizeAddOns } from '../utils/cart.js';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const normalizeCartItem = (item = {}) => {
  const addOns = normalizeAddOns(item.addOns);
  return {
    ...item,
    qty: Math.max(1, Number(item.qty || 1)),
    addOns,
    cartKey: item.cartKey || getCartItemKey(item._id, addOns)
  };
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]').map(normalizeCartItem);
    } catch {
      return [];
    }
  });

  const readPricingConfig = () => {
    try {
      const settings = JSON.parse(localStorage.getItem('store-settings-public') || 'null');
      return {
        shippingFee: Number(settings?.checkout?.shippingFee ?? 35),
        freeShippingThreshold: Number(settings?.checkout?.freeShippingThreshold ?? 500)
      };
    } catch {
      return { shippingFee: 35, freeShippingThreshold: 500 };
    }
  };

  const [pricingConfig, setPricingConfig] = useState(readPricingConfig);

  const persist = (next) => {
    const normalized = next.map(normalizeCartItem);
    setItems(normalized);
    localStorage.setItem('cart', JSON.stringify(normalized));
  };

  const addToCart = (product, qty = 1, addOns = []) => {
    const normalizedAddOns = normalizeAddOns(addOns);
    const cartKey = getCartItemKey(product._id, normalizedAddOns);
    const current = items.find((item) => item.cartKey === cartKey);
    const next = current
      ? items.map((item) => item.cartKey === cartKey ? { ...item, qty: item.qty + qty } : item)
      : [...items, { ...product, qty, addOns: normalizedAddOns, cartKey }];
    persist(next);
    toast.success('تمت الإضافة للسلة');
  };

  const removeFromCart = (cartKey) => persist(items.filter((item) => item.cartKey !== cartKey));

  const updateQty = (cartKey, qty) => {
    const safeQty = Math.max(1, Number(qty) || 1);
    persist(items.map((item) => item.cartKey === cartKey ? { ...item, qty: safeQty } : item));
  };

  const decrementQty = (cartKey) => {
    const current = items.find((item) => item.cartKey === cartKey);
    if (!current) return;
    if (Number(current.qty || 0) <= 1) {
      removeFromCart(cartKey);
      return;
    }
    updateQty(cartKey, Number(current.qty || 1) - 1);
  };

  const clearCart = () => persist([]);

  useEffect(() => {
    persist(items);
    // Normalize any legacy cart entries once after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const syncPricing = () => setPricingConfig(readPricingConfig());
    window.addEventListener('store-settings-updated', syncPricing);
    return () => window.removeEventListener('store-settings-updated', syncPricing);
  }, []);

  const totals = useMemo(() => {
    const itemsPrice = items.reduce((sum, item) => sum + getItemLinePrice(item), 0);
    const shipping = itemsPrice >= pricingConfig.freeShippingThreshold || itemsPrice === 0 ? 0 : pricingConfig.shippingFee;
    return {
      itemsPrice,
      shipping,
      total: itemsPrice + shipping,
      count: items.reduce((sum, item) => sum + item.qty, 0)
    };
  }, [items, pricingConfig]);

  return <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, decrementQty, clearCart, totals }}>{children}</CartContext.Provider>;
}
