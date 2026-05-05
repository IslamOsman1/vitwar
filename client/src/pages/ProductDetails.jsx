import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../api/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { isFavorite, toggleWishlist } = useWishlist();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <div className="container page"><p>جاري التحميل...</p></div>;

  const favorite = isFavorite(product._id);

  return <div className="container page product-details">
    <div className="detail-image">{product.image?.url ? <img src={product.image.url} alt={product.name} /> : <span>{product.category}</span>}</div>
    <div className="detail-info">
      <span className="category">{product.category}</span><h1>{product.name}</h1><p>{product.description}</p>
      <div className="big-price">{product.price} ج.م <small>/ {product.unit}</small></div>
      <p className="muted">المخزون: {product.countInStock}</p>
      <input type="number" min="1" max={product.countInStock} value={qty} onChange={e => setQty(e.target.value)} />
      <div className="detail-actions">
        <button className="primary-btn" onClick={() => addToCart(product, Number(qty))}>أضف للسلة</button>
        <button type="button" className={`wishlist-detail-btn${favorite ? ' active' : ''}`} onClick={() => toggleWishlist(product)}>
          <Heart size={18} /> {favorite ? 'في المفضلة' : 'أضف للمفضلة'}
        </button>
      </div>
    </div>
  </div>;
}
