import React, { createContext, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));

  const persist = (next) => {
    setItems(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  const isFavorite = (id) => items.some(item => item._id === id);

  const addToWishlist = (product) => {
    if (isFavorite(product._id)) {
      toast('المنتج موجود بالفعل في المفضلة');
      return;
    }

    persist([...items, product]);
    toast.success('تمت الإضافة إلى المفضلة');
  };

  const removeFromWishlist = (id) => {
    persist(items.filter(item => item._id !== id));
    toast.success('تمت الإزالة من المفضلة');
  };

  const toggleWishlist = (product) => {
    if (isFavorite(product._id)) {
      removeFromWishlist(product._id);
      return;
    }

    addToWishlist(product);
  };

  const value = useMemo(() => ({
    items,
    count: items.length,
    isFavorite,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  }), [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
