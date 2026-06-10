import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';
import { calculateCheckoutTotals } from '../utils/pricing.js';
import { getItemLinePrice, getItemUnitPrice } from '../utils/cart.js';

const checkoutDraftKey = 'checkout-draft';

export default function CheckoutReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, refreshProfile } = useAuth();
  const { items, clearCart, totals } = useCart();
  const { settings } = useStoreSettings();
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    const storedDraft = sessionStorage.getItem(checkoutDraftKey);
    if (!storedDraft) {
      navigate('/checkout');
      return;
    }

    try {
      setDraft(JSON.parse(storedDraft));
    } catch {
      navigate('/checkout');
    }
  }, [navigate]);

  useEffect(() => {
    if (!items.length) navigate('/cart');
  }, [items, navigate]);

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
      discountCode: draft?.discountCode,
      redeemLoyaltyPoints: false
    }),
    [draft, settings, shippingPrice, totals.itemsPrice, user]
  );

  const submit = async () => {
    if (!draft) return;
    setSubmitting(true);

    try {
      const payload = {
        orderItems: items.map((item) => ({
          product: item._id,
          qty: item.qty,
          addOns: (item.addOns || []).map((addOn) => ({
            addOnId: addOn._id,
            qty: addOn.qty || 1
          }))
        })),
        shippingAddress: draft.shippingAddress,
        paymentMethod: 'cod',
        discountCode: draft.discountCode,
        fulfillmentMethod: draft.fulfillmentMethod
      };

      await api.post('/orders', payload);
      await refreshProfile().catch(() => undefined);
      clearCart();
      sessionStorage.removeItem(checkoutDraftKey);
      toast.success('تم إنشاء الطلب');
      navigate('/checkout/success');
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إنشاء الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  if (!draft) return null;

  return (
    <div className="container page checkout-page">
      <div className="section-head">
        <div>
          <h1>إكمال الطلب</h1>
          <p>راجع البيانات والمنتجات قبل تأكيد الطلب النهائي.</p>
        </div>
        {searchParams.get('cancelled') ? <span className="muted">تم إلغاء الدفع ويمكنك المحاولة مرة أخرى بدون إنشاء طلب.</span> : null}
      </div>

      <div className="checkout-layout">
        <section className="checkout-panel checkout-review-panel">
          <div className="checkout-review-block">
            <strong>طريقة الاستلام</strong>
            <p>
              {draft.fulfillmentMethod === 'cafe'
                ? 'الكافيهات المجاورة'
                : draft.fulfillmentMethod === 'delivery'
                  ? 'التوصيل للمنزل'
                  : 'استلام من المطعم'}
            </p>
          </div>

          <div className="checkout-review-block">
            <strong>البيانات</strong>
            <p>{draft.shippingAddress.fullName}</p>
            <p>{draft.shippingAddress.phone}</p>
            {draft.fulfillmentMethod !== 'delivery' ? <p>الفرع: {draft.shippingAddress.branch || '-'}</p> : null}
            {draft.fulfillmentMethod === 'delivery' ? (
              <>
                <p>المحافظة: {draft.shippingAddress.governorate || draft.shippingAddress.city}</p>
                <p>المدينة: {draft.shippingAddress.city || draft.shippingAddress.area}</p>
                <p>العنوان: {draft.shippingAddress.street}</p>
              </>
            ) : null}
            {draft.fulfillmentMethod === 'cafe' ? <p>{draft.shippingAddress.cafeName}</p> : null}
            {draft.shippingAddress.notes ? <p>{draft.shippingAddress.notes}</p> : null}
          </div>

          <div className="checkout-review-block">
            <strong>طريقة الدفع</strong>
            <p>الدفع عند التوصيل</p>
          </div>

          {draft.discountCode ? (
            <div className="checkout-review-block">
              <strong>الخصومات المطبقة</strong>
              <p>كود الخصم: {draft.discountCode}</p>
            </div>
          ) : null}

          <div className="checkout-review-block">
            <strong>المنتجات</strong>
            <div className="checkout-review-items">
              {items.map((item) => (
                <div className="checkout-review-item" key={item.cartKey || item._id}>
                  <div>
                    <span>{item.name}</span>
                    {item.addOns?.length ? (
                      <div className="checkout-review-addons">
                        {item.addOns.map((addOn) => (
                          <small key={`${item.cartKey}-${addOn._id}`}>+ {addOn.name} ({addOn.price} ج.م)</small>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <small>{item.qty} × {getItemUnitPrice(item)} ج.م = {getItemLinePrice(item)} ج.م</small>
                </div>
              ))}
            </div>
          </div>

          <div className="checkout-review-block">
            <strong>سياسات مهمة قبل التأكيد</strong>
            <p className="checkout-policy-copy">
              بإتمام الطلب فأنت توافق على <Link to="/policies/terms">الشروط والأحكام</Link> و<Link to="/policies/privacy">سياسة الخصوصية</Link>،
              كما يمكنك مراجعة <Link to="/policies/shipping">سياسة الشحن</Link> و<Link to="/policies/refund">سياسة الاسترجاع</Link>.
            </p>
          </div>

          <div className="checkout-review-actions">
            <Link to="/checkout" className="secondary-btn">العودة للتعديل</Link>
            <button type="button" className="primary-btn" onClick={submit} disabled={submitting}>
              {submitting ? 'جارٍ التنفيذ...' : 'تأكيد الطلب'}
            </button>
          </div>
        </section>

        <aside className="summary checkout-summary-panel">
          <h2>ملخص الطلب</h2>
          <p>المنتجات: {totals.itemsPrice} ج.م</p>
          <p>الشحن: {shippingPrice} ج.م</p>
          {draft.discountCode ? <p className="muted">سيتم اعتماد كود الخصم بعد التحقق منه من السيرفر</p> : null}
          <strong>الإجمالي المتوقع: {estimatedTotals.totalPrice} ج.م</strong>
        </aside>
      </div>
    </div>
  );
}
