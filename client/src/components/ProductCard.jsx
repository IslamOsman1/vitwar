import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Check, Minus, Plus, ShoppingBasket, X } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { normalizeAddOns } from '../utils/cart.js';

const formatMeasurement = (product) => {
  const value = Number(product?.measurementValue || 0);
  const unit = String(product?.measurementUnit || '').trim();
  return value > 0 && unit ? `${value} ${unit}` : product.unit;
};

const hasTrackedStock = (product) => product?.countInStock !== null && product?.countInStock !== undefined && product?.countInStock !== '';
const isOutOfStock = (product) => hasTrackedStock(product) && Number(product.countInStock) < 1;

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [addOnsOpen, setAddOnsOpen] = useState(false);
  const [selectedAddOnsMap, setSelectedAddOnsMap] = useState({});
  const [qty, setQty] = useState(1);
  const addOnOptions = useMemo(
    () => (Array.isArray(product.availableAddOns) ? product.availableAddOns.filter((item) => item?._id && item.active !== false) : []),
    [product.availableAddOns]
  );
  const selectedAddOns = normalizeAddOns(addOnOptions
    .filter((item) => Number(selectedAddOnsMap[item._id] || 0) > 0)
    .map((item) => ({ ...item, qty: selectedAddOnsMap[item._id] })));

  const incrementAddOn = (addOnId) => {
    setSelectedAddOnsMap((current) => ({
      ...current,
      [addOnId]: Number(current[addOnId] || 0) + 1
    }));
  };

  const decrementAddOn = (addOnId) => {
    setSelectedAddOnsMap((current) => {
      const nextQty = Number(current[addOnId] || 0) - 1;
      const next = { ...current };
      if (nextQty > 0) next[addOnId] = nextQty;
      else delete next[addOnId];
      return next;
    });
  };

  const resetAddOnsPrompt = () => {
    setSelectedAddOnsMap({});
    setQty(1);
    setAddOnsOpen(false);
  };

  const handleAddClick = () => {
    if (addOnOptions.length) {
      setAddOnsOpen(true);
      return;
    }
    addToCart(product);
  };

  const confirmAddToCart = () => {
    addToCart(product, Math.max(1, Number(qty) || 1), selectedAddOns);
    resetAddOnsPrompt();
  };

  return <article className="product-card">
    <Link to={`/product/${product._id}`} className="product-image">
      {product.isDeal && <span className="badge">عرض</span>}
      {product.image?.url ? (
        <img
          src={product.image.url}
          alt={product.name}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 360px) 100vw, (max-width: 768px) 50vw, 25vw"
        />
      ) : <div className="placeholder"><ShoppingBasket size={42} /><span>{product.category}</span></div>}
    </Link>

    <div className="product-body">
      <div className="product-topline">
        <span className="category">{product.category}</span>
        <span className="stock-state">
          {isOutOfStock(product)
            ? 'نفد'
            : hasTrackedStock(product)
              ? `متاح ${product.countInStock}`
              : 'متوفر'}
        </span>
      </div>
      <Link to={`/product/${product._id}`}><h3>{product.name}</h3></Link>
      <p>{formatMeasurement(product)}</p>
      <div className="price-row">
        <strong>{product.price} ج.م</strong>
        {product.oldPrice > product.price && <del>{product.oldPrice} ج.م</del>}
      </div>
      <div className="product-actions-row">
        <button className="add-mini" onClick={handleAddClick} disabled={isOutOfStock(product)}>
          <Plus size={18} /> أضف للسلة
        </button>
      </div>
    </div>
    {addOnsOpen ? createPortal((
      <div className="product-addons-prompt-overlay" onClick={resetAddOnsPrompt}>
        <div className="product-addons-prompt" onClick={(event) => event.stopPropagation()}>
          <div className="product-addons-prompt-head">
            <div>
              <span className="market-pill">إضافات المنتج</span>
              <h2>{product.name}</h2>
              <p>اختر الإضافات التي تريدها وسيتم تحديث السعر فورًا.</p>
            </div>
            <button type="button" className="product-addons-prompt-close" onClick={resetAddOnsPrompt} aria-label="إغلاق">
              <X size={18} />
            </button>
          </div>

          <div className="product-addons-prompt-list">
            {addOnOptions.map((addOn) => {
              const selectedQty = Number(selectedAddOnsMap[addOn._id] || 0);
              const checked = selectedQty > 0;
              return (
                <div key={addOn._id} className={`product-detail-addon-option${checked ? ' selected' : ''}`}>
                  <div className="product-detail-addon-controls">
                    <button type="button" onClick={() => incrementAddOn(addOn._id)} aria-label="إضافة">
                      <Plus size={18} />
                    </button>
                    {checked ? (
                      <>
                        <span>{selectedQty}</span>
                        <button type="button" onClick={() => decrementAddOn(addOn._id)} aria-label="تقليل">
                          <Minus size={16} />
                        </button>
                      </>
                    ) : (
                      <span className="product-detail-addon-check"><Check size={16} /></span>
                    )}
                  </div>
                  <span className="product-detail-addon-thumb">
                    {addOn.image ? <img src={addOn.image} alt={addOn.name} loading="lazy" decoding="async" /> : null}
                  </span>
                  <div className="product-detail-addon-copy">
                    <strong>{addOn.name}</strong>
                    <small>{addOn.price} ج.م</small>
                  </div>
                </div>
              );
            })}
          </div>

          <input
            className="product-addons-prompt-qty"
            type="number"
            min="1"
            value={qty}
            onChange={(event) => setQty(event.target.value)}
            aria-label="كمية المنتج"
          />
          <button type="button" className="primary-btn product-addons-prompt-submit" onClick={confirmAddToCart}>
            أضف للسلة
          </button>
        </div>
      </div>
    ), document.body) : null}
  </article>;
}
