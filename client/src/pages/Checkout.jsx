import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';
import { calculateCheckoutTotals } from '../utils/pricing.js';

const checkoutDraftKey = 'checkout-draft';

const buildInitialCheckoutFields = (user) => ({
  fullName: user?.role === 'admin' ? '' : (user?.name || ''),
  phone: user?.phone || '',
  governorate: '',
  city: '',
  street: '',
  branch: '',
  notes: '',
  cafeName: '',
  pickupType: 'restaurant'
});

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totals } = useCart();
  const { settings } = useStoreSettings();
  const [profileUser, setProfileUser] = useState(user);
  const [shippingAddress, setAddress] = useState(() => buildInitialCheckoutFields(user));
  const [discountCode, setDiscountCode] = useState('');
  const [fulfillmentMethod, setFulfillmentMethod] = useState('restaurant');

  const isNearbyCafe = fulfillmentMethod === 'cafe';
  const isDeliveryHome = fulfillmentMethod === 'delivery';
  const governorates = settings?.checkout?.governorates || [];
  const selectedGovernorate = useMemo(
    () => governorates.find((item) => String(item.name || '').trim() === String(shippingAddress.governorate || '').trim()) || null,
    [governorates, shippingAddress.governorate]
  );
  const selectedGovernorateCities = useMemo(
    () => (selectedGovernorate?.cities || []).filter(Boolean),
    [selectedGovernorate]
  );
  const notesEnabled = true;
  const notesRequired = false;
  const shippingPrice = useMemo(
    () => 0,
    []
  );

  const estimatedTotals = useMemo(
    () => calculateCheckoutTotals({
      itemsPrice: totals.itemsPrice,
      shippingPrice,
      settings,
      user,
      discountCode,
      redeemLoyaltyPoints: false
    }),
    [discountCode, settings, shippingPrice, totals.itemsPrice, user]
  );

  useEffect(() => {
    setProfileUser(user);
  }, [user]);

  useEffect(() => {
    const nextBase = buildInitialCheckoutFields(profileUser);
    setAddress((current) => ({
      ...current,
      fullName: current.fullName || nextBase.fullName,
      phone: current.phone || nextBase.phone,
      notes: current.notes || '',
      cafeName: current.cafeName || '',
      branch: current.branch || '',
      governorate: current.governorate || '',
      city: current.city || '',
      pickupType: current.pickupType || nextBase.pickupType
    }));
  }, [profileUser]);

  useEffect(() => {
    const draft = sessionStorage.getItem(checkoutDraftKey);
    if (!draft) return;
    try {
      const parsed = JSON.parse(draft);
      if (parsed.fulfillmentMethod) setFulfillmentMethod(parsed.fulfillmentMethod);
      if (parsed.shippingAddress) {
        setAddress({
          ...buildInitialCheckoutFields(profileUser),
          ...parsed.shippingAddress,
          fullName: profileUser?.role === 'admin' ? '' : (parsed.shippingAddress.fullName || '')
        });
      }
      if (parsed.discountCode) setDiscountCode(parsed.discountCode);
    } catch {
      return;
    }
  }, [profileUser]);

  useEffect(() => {
    if (!items.length) navigate('/cart');
  }, [items, navigate]);

  const checkoutOptions = useMemo(() => {
    const options = [];
    options.push({
      kind: 'fulfillment',
      value: 'restaurant',
      label: 'استلام من المطعم',
      note: 'الدفع عند وصول الطلب'
    });
    options.push({
      kind: 'fulfillment',
      value: 'cafe',
      label: 'الكافيهات المجاورة',
      note: 'استلام من أقرب كافيه متاح'
    });
    options.push({
      kind: 'fulfillment',
      value: 'delivery',
      label: 'التوصيل للمنزل',
      note: 'نفس فورم الدفع عند الاستلام'
    });
    return options;
  }, [settings]);

  const change = (event) => {
    const { name, value } = event.target;
    setAddress((current) => {
      return { ...current, [name]: value };
    });
  };

  const selectGovernorate = (event) => {
    const nextGovernorate = event.target.value;
    setAddress((current) => ({
      ...current,
      governorate: nextGovernorate,
      city: ''
    }));
  };

  const selectCity = (event) => {
    setAddress((current) => ({
      ...current,
      city: event.target.value
    }));
  };

  const selectFulfillmentMethod = (nextMethod) => {
    setFulfillmentMethod(nextMethod);
    setAddress((current) => ({
      ...current,
      pickupType: nextMethod,
      governorate: nextMethod === 'delivery' ? current.governorate || '' : '',
      city: nextMethod === 'delivery' ? current.city || '' : '',
      street: nextMethod === 'delivery' ? current.street || '' : '',
      branch: nextMethod !== 'delivery' ? current.branch || '' : '',
      cafeName: nextMethod === 'cafe' ? current.cafeName || '' : '',
      notes: current.notes || ''
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    const draft = {
      shippingAddress: {
        ...shippingAddress,
        area: shippingAddress.city || ''
      },
      paymentMethod: 'cod',
      discountCode,
      fulfillmentMethod
    };
    sessionStorage.setItem(checkoutDraftKey, JSON.stringify(draft));
    navigate('/checkout/review');
  };

  return (
    <div className="container page checkout-page">
      <div className="section-head">
        <div>
          <h1>التشيك أوت</h1>
          <p>أدخل بيانات الشحن واختر طريقة الدفع المناسبة لك.</p>
        </div>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form checkout-panel" onSubmit={submit}>
          <input
            name="fullName"
            value={shippingAddress.fullName}
            placeholder="الاسم بالكامل"
            onChange={change}
            required
          />

          <input
            name="phone"
            value={shippingAddress.phone}
            placeholder="رقم الهاتف"
            onChange={change}
            required
          />

          {!isDeliveryHome ? (
            <select
              name="branch"
              value={shippingAddress.branch}
              onChange={change}
              required
            >
              <option value="">اختر الفرع</option>
              <option value="التجمع الاول">التجمع الاول</option>
              <option value="التجمع الخامس">التجمع الخامس</option>
            </select>
          ) : null}

          {isDeliveryHome ? (
            <>
              <select
                name="governorate"
                value={shippingAddress.governorate}
                onChange={selectGovernorate}
                required
              >
                <option value="">اختر المحافظة</option>
                {governorates.map((governorate) => (
                  <option key={governorate.name} value={governorate.name}>
                    {governorate.name}
                  </option>
                ))}
              </select>
              <select
                name="city"
                value={shippingAddress.city}
                onChange={selectCity}
                required
                disabled={!selectedGovernorateCities.length}
              >
                <option value="">اختر المدينة</option>
                {selectedGovernorateCities.map((city) => (
                  <option key={`${shippingAddress.city}-${city}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <input
                name="street"
                value={shippingAddress.street}
                placeholder="العنوان التفصيلي"
                onChange={change}
                required
              />
            </>
          ) : null}

          {isNearbyCafe ? (
            <input
              name="cafeName"
              value={shippingAddress.cafeName}
              placeholder="اسم الكافيه المجاور"
              onChange={change}
              required
            />
          ) : null}

          {notesEnabled ? (
            <textarea
              name="notes"
              value={shippingAddress.notes}
              placeholder={isNearbyCafe ? 'ملاحظات عن الكافيه أو الطلب' : 'ملاحظات الطلب'}
              onChange={change}
              required={notesRequired}
            />
          ) : null}

          <div className="checkout-loyalty-box">
            <strong>كود الخصم</strong>
            <input
              value={discountCode}
              onChange={(event) => setDiscountCode(event.target.value.toUpperCase())}
              placeholder="أدخل كود الخصم"
            />
          </div>

          <div className="checkout-payment-options">
            {checkoutOptions.map((option) => (
              <label
                key={`${option.kind}-${option.value}`}
                className={`payment-option-card${fulfillmentMethod === option.value ? ' active' : ''}`}
              >
                <input
                  type="radio"
                  name="fulfillmentMethod"
                  value={option.value}
                  checked={fulfillmentMethod === option.value}
                  onChange={(event) => selectFulfillmentMethod(event.target.value)}
                />
                <strong>{option.label}</strong>
                <span>{option.note}</span>
              </label>
            ))}
          </div>

          <button className="primary-btn">متابعة إلى إكمال الطلب</button>
        </form>

        <aside className="summary checkout-summary-panel">
          <h2>ملخص الطلب</h2>
          <p>المنتجات: {totals.itemsPrice} ج.م</p>
          <p>الشحن: {shippingPrice} ج.م</p>
          {discountCode ? <p className="muted">سيتم التحقق من كود الخصم عند تأكيد الطلب</p> : null}
          <strong>الإجمالي المتوقع: {estimatedTotals.totalPrice} ج.م</strong>
        </aside>
      </div>
    </div>
  );
}
