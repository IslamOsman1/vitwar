import React, { createContext, useContext, useMemo, useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
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
  const persist = (next) => { setItems(next); localStorage.setItem('cart', JSON.stringify(next)); };
  const addToCart = (product, qty = 1) => {
    const current = items.find(i => i._id === product._id);
    const next = current ? items.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i) : [...items, { ...product, qty }];
    persist(next); toast.success('تمت الإضافة للسلة');
  };
  const removeFromCart = (id) => persist(items.filter(i => i._id !== id));
  const updateQty = (id, qty) => persist(items.map(i => i._id === id ? { ...i, qty: Math.max(1, Number(qty)) } : i));
  const clearCart = () => persist([]);
  useEffect(() => {
    const syncPricing = () => setPricingConfig(readPricingConfig());
    window.addEventListener('store-settings-updated', syncPricing);
    return () => window.removeEventListener('store-settings-updated', syncPricing);
  }, []);
  const totals = useMemo(() => {
    const itemsPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = itemsPrice >= pricingConfig.freeShippingThreshold || itemsPrice === 0 ? 0 : pricingConfig.shippingFee;
    return {
      itemsPrice,
      shipping,
      total: itemsPrice + shipping,
      count: items.reduce((s, i) => s + i.qty, 0)
    };
  }, [items, pricingConfig]);
  return <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totals }}>{children}</CartContext.Provider>;
}
