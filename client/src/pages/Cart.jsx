import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { getItemLinePrice, getItemUnitPrice } from '../utils/cart.js';

export default function Cart() {
  const { items, updateQty, decrementQty, removeFromCart, totals } = useCart();

  return (
    <div className="container page">
      <h1>سلة التسوق</h1>

      {!items.length ? (
        <p>السلة فارغة. <Link to="/">ابدأ التسوق</Link></p>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => (
              <div className="cart-item" key={item.cartKey || item._id}>
                {item.image?.url ? <img src={item.image.url} alt={item.name} loading="lazy" decoding="async" sizes="80px" /> : null}
                <div>
                  <h3>{item.name}</h3>
                  <p>{getItemUnitPrice(item)} ج.م</p>
                  {item.addOns?.length ? (
                    <div className="cart-item-addons">
                      {item.addOns.map((addOn) => (
                        <small key={`${item.cartKey}-${addOn._id}`}>+ {addOn.name} ({addOn.price} ج.م)</small>
                      ))}
                    </div>
                  ) : null}
                  <small>الإجمالي: {getItemLinePrice(item)} ج.م</small>
                </div>
                <div className="cart-item-qty">
                  <button type="button" onClick={() => decrementQty(item.cartKey || item._id)} aria-label="تقليل الكمية">
                    <Minus size={16} />
                  </button>
                  <input type="number" min="1" value={item.qty} onChange={(event) => updateQty(item.cartKey || item._id, event.target.value)} />
                </div>
                <button type="button" onClick={() => removeFromCart(item.cartKey || item._id)} aria-label="حذف من السلة"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>

          <aside className="summary">
            <h2>ملخص الطلب</h2>
            <p>المنتجات: {totals.itemsPrice} ج.م</p>
            <p>الشحن: يحدد حسب المحافظة</p>
            <strong>الإجمالي المبدئي: {totals.itemsPrice} ج.م</strong>
            <Link className="primary-btn" to="/checkout">إتمام الشراء</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
