import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MapPin } from 'lucide-react';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';
import { calculateCheckoutTotals } from '../utils/pricing.js';
import { calculateShippingForGovernorate } from '../utils/shipping.js';

const checkoutDraftKey = 'checkout-draft';

const buildInitialAddress = (user) => ({
  fullName: user?.name || '',
  phone: user?.phone || '',
  city: '',
  area: '',
  street: '',
  notes: ''
});

const buildAddressFromSavedAddress = (address, user) => ({
  fullName: user?.name || '',
  phone: user?.phone || '',
  city: address?.governorate || '',
  area: address?.city || '',
  street: address?.street || address?.address || '',
  notes: address?.notes || ''
});

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totals } = useCart();
  const { settings } = useStoreSettings();
  const [profileUser, setProfileUser] = useState(user);
  const [shippingAddress, setAddress] = useState(() => buildInitialAddress(user));
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [discountCode, setDiscountCode] = useState('');

  const savedAddresses = useMemo(
    () => Array.isArray(profileUser?.addresses) ? profileUser.addresses.filter((item) => item?.street || item?.address) : [],
    [profileUser]
  );

  const availableGovernorates = useMemo(
    () => settings?.checkout?.governorates || [],
    [settings]
  );

  const availableCities = useMemo(() => {
    const selectedGovernorate = availableGovernorates.find((item) => item.name === shippingAddress.city);
    return selectedGovernorate?.cities || [];
  }, [availableGovernorates, shippingAddress.city]);

  const notesEnabled = settings?.checkout?.notesEnabled !== false;
  const notesRequired = Boolean(settings?.checkout?.notesEnabled && settings?.checkout?.notesRequired);
  const shippingPrice = useMemo(
    () => calculateShippingForGovernorate(settings, shippingAddress.city, totals.itemsPrice),
    [settings, shippingAddress.city, totals.itemsPrice]
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
    api.get('/users/me')
      .then(({ data }) => setProfileUser(data))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const nextBase = buildInitialAddress(profileUser);
    setAddress((current) => ({
      ...current,
      fullName: current.fullName || nextBase.fullName,
      phone: current.phone || nextBase.phone,
      city: current.city || '',
      area: current.area || '',
      street: current.street || '',
      notes: current.notes || ''
    }));
  }, [profileUser]);

  useEffect(() => {
    const draft = sessionStorage.getItem(checkoutDraftKey);
    if (!draft) return;
    try {
      const parsed = JSON.parse(draft);
      if (parsed.shippingAddress) {
        setAddress({
          ...buildInitialAddress(profileUser),
          ...parsed.shippingAddress
        });
      }
      if (parsed.selectedAddressId) setSelectedAddressId(parsed.selectedAddressId);
      if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
      if (parsed.discountCode) setDiscountCode(parsed.discountCode);
    } catch {
      return;
    }
  }, [profileUser]);

  useEffect(() => {
    if (!selectedAddressId) return;
    const selectedAddress = savedAddresses.find((item) => item._id === selectedAddressId);
    if (!selectedAddress) return;
    setAddress(buildAddressFromSavedAddress(selectedAddress, profileUser));
  }, [profileUser, savedAddresses, selectedAddressId]);

  useEffect(() => {
    if (!items.length) navigate('/cart');
  }, [items, navigate]);

  const paymentOptions = useMemo(() => {
    const options = [];
    if (settings?.payment?.cashOnDeliveryEnabled !== false) {
      options.push({
        value: 'cod',
        label: 'الدفع عند الاستلام',
        note: 'الدفع عند وصول الطلب'
      });
    }
    if (settings?.payment?.onlinePaymentEnabled) {
      options.push({
        value: 'online',
        label: 'دفع أونلاين',
        note: 'الدفع الآن ببطاقة بنكية عبر الإنترنت'
      });
    }
    return options;
  }, [settings]);

  const change = (event) => {
    const { name, value } = event.target;
    setAddress((current) => {
      const next = { ...current, [name]: value };
      if (name === 'city') next.area = '';
      return next;
    });
  };

  const selectSavedAddress = (nextId) => {
    setSelectedAddressId(nextId);
    if (!nextId) {
      setAddress((current) => ({
        ...current,
        fullName: profileUser?.name || current.fullName || '',
        phone: profileUser?.phone || current.phone || '',
        city: '',
        area: '',
        street: '',
        notes: ''
      }));
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const draft = {
      shippingAddress,
      selectedAddressId,
      paymentMethod,
      discountCode
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
          {savedAddresses.length ? (
            <div className="checkout-loyalty-box">
              <strong>العناوين المحفوظة</strong>
              <div className="checkout-saved-addresses">
                <button
                  type="button"
                  className={`checkout-saved-address-card${selectedAddressId === '' ? ' active' : ''}`}
                  onClick={() => selectSavedAddress('')}
                >
                  <div className="checkout-saved-address-head">
                    <span>إدخال يدوي</span>
                    {selectedAddressId === '' ? <Check size={16} /> : <MapPin size={16} />}
                  </div>
                  <small>اكتب عنوانًا جديدًا بنفسك</small>
                </button>

                {savedAddresses.map((address) => (
                  <button
                    key={address._id}
                    type="button"
                    className={`checkout-saved-address-card${selectedAddressId === address._id ? ' active' : ''}`}
                    onClick={() => selectSavedAddress(address._id)}
                  >
                    <div className="checkout-saved-address-head">
                      <span>{address.label || 'عنوان محفوظ'}</span>
                      {selectedAddressId === address._id ? <Check size={16} /> : <MapPin size={16} />}
                    </div>
                    <small>{[address.governorate, address.city].filter(Boolean).join(' - ') || 'بدون مدينة محددة'}</small>
                    <p>{address.street || address.address || 'بدون عنوان تفصيلي'}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

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

          {availableGovernorates.length ? (
            <select name="city" value={shippingAddress.city} onChange={change} required>
              <option value="">اختر المحافظة</option>
              {availableGovernorates.map((governorate) => (
                <option key={governorate.name} value={governorate.name}>{governorate.name}</option>
              ))}
            </select>
          ) : (
            <input
              name="city"
              value={shippingAddress.city}
              placeholder="المحافظة"
              onChange={change}
              required
            />
          )}

          {availableCities.length ? (
            <select name="area" value={shippingAddress.area} onChange={change} required>
              <option value="">اختر المدينة</option>
              {availableCities.map((cityName) => (
                <option key={cityName} value={cityName}>{cityName}</option>
              ))}
            </select>
          ) : (
            <input
              name="area"
              value={shippingAddress.area}
              placeholder="المدينة أو المنطقة"
              onChange={change}
              required
            />
          )}

          <input
            name="street"
            value={shippingAddress.street}
            placeholder="العنوان التفصيلي"
            onChange={change}
            required
          />

          {notesEnabled ? (
            <textarea
              name="notes"
              value={shippingAddress.notes}
              placeholder="ملاحظات"
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
            {paymentOptions.map((option) => (
              <label key={option.value} className={`payment-option-card${paymentMethod === option.value ? ' active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={paymentMethod === option.value}
                  onChange={(event) => setPaymentMethod(event.target.value)}
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
