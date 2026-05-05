import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

const checkoutDraftKey = 'checkout-draft';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totals } = useCart();
  const { settings } = useStoreSettings();
  const [shippingAddress, setAddress] = useState({
    fullName: '',
    phone: '',
    city: '',
    area: '',
    street: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    const draft = sessionStorage.getItem(checkoutDraftKey);
    if (!draft) return;
    try {
      const parsed = JSON.parse(draft);
      if (parsed.shippingAddress) setAddress(parsed.shippingAddress);
      if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    if (!items.length) navigate('/cart');
  }, [items, navigate]);

  const paymentOptions = useMemo(() => {
    const options = [];
    if (settings?.payment?.cashOnDeliveryEnabled !== false) {
      options.push({ value: 'cod', label: 'الدفع عند الاستلام', note: 'الدفع عند وصول الطلب' });
    }
    if (settings?.payment?.onlinePaymentEnabled) {
      options.push({ value: 'online', label: 'دفع أونلاين', note: 'الدفع الآن ببطاقة بنكية عبر الإنترنت' });
    }
    return options;
  }, [settings]);

  const change = (event) => setAddress({ ...shippingAddress, [event.target.name]: event.target.value });

  const submit = (event) => {
    event.preventDefault();
    const draft = { shippingAddress, paymentMethod };
    sessionStorage.setItem(checkoutDraftKey, JSON.stringify(draft));
    navigate('/checkout/review');
  };

  return <div className="container page checkout-page">
    <div className="section-head">
      <div>
        <h1>التشيك أوت</h1>
        <p>أدخل بيانات الشحن واختر طريقة الدفع المناسبة لك.</p>
      </div>
    </div>

    <div className="checkout-layout">
      <form className="checkout-form checkout-panel" onSubmit={submit}>
        {Object.keys(shippingAddress).map((field) => <input
          key={field}
          name={field}
          value={shippingAddress[field]}
          placeholder={{
            fullName: 'الاسم بالكامل',
            phone: 'رقم الهاتف',
            city: 'المحافظة',
            area: 'المنطقة',
            street: 'العنوان التفصيلي',
            notes: 'ملاحظات'
          }[field]}
          onChange={change}
          required={field !== 'notes'}
        />)}

        <div className="checkout-payment-options">
          {paymentOptions.map((option) => <label key={option.value} className={`payment-option-card${paymentMethod === option.value ? ' active' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value={option.value}
              checked={paymentMethod === option.value}
              onChange={(event) => setPaymentMethod(event.target.value)}
            />
            <strong>{option.label}</strong>
            <span>{option.note}</span>
          </label>)}
        </div>

        <button className="primary-btn">متابعة إلى إكمال الطلب</button>
      </form>

      <aside className="summary checkout-summary-panel">
        <h2>ملخص الطلب</h2>
        <p>المنتجات: {totals.itemsPrice} ج.م</p>
        <p>الشحن: {totals.shipping} ج.م</p>
        <strong>الإجمالي: {totals.total} ج.م</strong>
      </aside>
    </div>
  </div>;
}
