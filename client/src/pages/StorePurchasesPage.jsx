import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Award, Camera, QrCode, Save, Search, Store, Wallet, X } from 'lucide-react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyStorePurchaseForm = { amount: '', note: '' };

function SearchBox({ value, onChange, onCameraClick }) {
  return (
    <label className="admin-search-box store-purchases-mobile-search-box">
      <button
        type="button"
        className="admin-search-camera"
        onClick={onCameraClick}
        aria-label="قراءة QR بالكاميرا"
      >
        <Camera size={18} />
      </button>
      <Search size={18} />
      <input
        value={value}
        onChange={onChange}
        placeholder="ابحث بالـ QR أو رقم الهاتف أو الاسم أو البريد الإلكتروني..."
      />
    </label>
  );
}

export default function StorePurchasesPage() {
  const { user } = useAuth();
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [storePurchaseForm, setStorePurchaseForm] = useState(emptyStorePurchaseForm);
  const [submitting, setSubmitting] = useState(false);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [qrScannerStarting, setQrScannerStarting] = useState(false);
  const [qrScannerStatus, setQrScannerStatus] = useState('');
  const qrVideoRef = useRef(null);
  const qrReaderRef = useRef(null);
  const qrControlsRef = useRef(null);

  const canManageCustomers = user?.role === 'admin' || user?.permissions?.includes('manage_customers');

  const selectedCustomer = useMemo(
    () => customerResults.find((entry) => entry._id === selectedCustomerId) || null,
    [customerResults, selectedCustomerId]
  );

  const loadCustomerCareUsers = async (query = '') => {
    if (!canManageCustomers) return;
    if (!query.trim()) {
      setCustomerResults([]);
      setSelectedCustomerId('');
      return;
    }

    setCustomerLoading(true);

    try {
      const { data } = await api.get('/users/customer-care', {
        params: { q: query }
      });

      const nextResults = Array.isArray(data) ? data : [];
      setCustomerResults(nextResults);
      setSelectedCustomerId((current) => {
        if (current && nextResults.some((item) => item._id === current)) return current;
        return nextResults[0]?._id || '';
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'تعذر تحميل العميل المطلوب');
    } finally {
      setCustomerLoading(false);
    }
  };

  useEffect(() => () => {
    qrControlsRef.current?.stop?.();
    qrReaderRef.current?.reset?.();
  }, []);

  useEffect(() => {
    if (!canManageCustomers) return undefined;
    const timer = window.setTimeout(() => {
      loadCustomerCareUsers(customerSearch);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [customerSearch, canManageCustomers]);

  const closeQrScanner = () => {
    qrControlsRef.current?.stop?.();
    qrControlsRef.current = null;
    qrReaderRef.current?.reset?.();
    setQrScannerOpen(false);
    setQrScannerStarting(false);
    setQrScannerStatus('');
  };

  const openQrScanner = () => {
    setQrScannerOpen(true);
    setQrScannerStarting(false);
    setQrScannerStatus('للبدء اضغط على زر السماح بالكاميرا.');
  };

  const requestQrScanner = async () => {
    setQrScannerStarting(true);
    setQrScannerStatus('جارٍ تشغيل الكاميرا وقراءة QR...');

    if (!window.isSecureContext) {
      setQrScannerStatus('فتح الكاميرا يتطلب رابط https مباشر للموقع.');
      setQrScannerStarting(false);
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setQrScannerStatus('هذا المتصفح لا يدعم فتح الكاميرا.');
      setQrScannerStarting(false);
      return;
    }

    try {
      qrControlsRef.current?.stop?.();
      qrReaderRef.current?.reset?.();

      if (!qrReaderRef.current) {
        qrReaderRef.current = new BrowserQRCodeReader();
      }

      const controls = await qrReaderRef.current.decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        },
        qrVideoRef.current,
        (result, error) => {
          const code = result?.getText?.();

          if (code) {
            setCustomerSearch(code);
            closeQrScanner();
            toast.success(`تمت قراءة QR: ${code}`);
            return;
          }

          if (!error || ['NotFoundException', 'ChecksumException', 'FormatException'].includes(error.name)) {
            setQrScannerStatus('وجّه رمز QR داخل الإطار وثبّته لثانية واحدة...');
            return;
          }

          setQrScannerStatus('تعذر قراءة QR حاليًا، حاول تقريب الكاميرا أو تحسين الإضاءة.');
        }
      );

      qrControlsRef.current = controls;
      setQrScannerStatus('وجّه رمز QR داخل الإطار وثبّته لثانية واحدة...');
    } catch {
      setQrScannerStatus('تعذر تشغيل الكاميرا. تأكد من السماح بالكاميرا وفتح الرابط المباشر للموقع.');
      setQrScannerStarting(false);
    }
  };

  const submitStorePurchase = async (event) => {
    event.preventDefault();

    if (!selectedCustomer) {
      toast.error('اختر عميلًا أولًا');
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await api.post(`/users/${selectedCustomer._id}/customer-care`, {
        actionType: 'store_purchase',
        ...storePurchaseForm
      });

      const updatedCustomer = data.user;
      setCustomerResults((current) => current.map((item) => item._id === updatedCustomer._id ? updatedCustomer : item));
      setSelectedCustomerId(updatedCustomer._id);
      setStorePurchaseForm(emptyStorePurchaseForm);
      toast.success(data.message || 'تم تسجيل الشراء بنجاح');
    } catch (error) {
      toast.error(error.response?.data?.message || 'تعذر تسجيل الشراء');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  if (!canManageCustomers) {
    return (
      <main className="container page store-purchases-mobile-page">
        <section className="admin-setting-card">
          <p className="muted">ليس لديك صلاحية الوصول إلى تسجيل الشراء من المحل.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container page store-purchases-mobile-page">
      <section className="store-purchases-mobile-shell">
        <header className="store-purchases-mobile-hero">
          <div>
            <span className="market-pill">تسجيل الشراء من المحل</span>
            <h1>سجّل عملية البيع بسرعة من الموبايل</h1>
            <p>ابدأ بالبحث أو قراءة QR، وبعدها سيظهر العميل المطلوب فقط مع فورم تسجيل الشراء.</p>
          </div>
          <Link to="/admin" className="store-purchases-mobile-back">
            <ArrowRight size={18} />
            <span>العودة للوحة التحكم</span>
          </Link>
        </header>

        <section className="store-purchases-mobile-stage">
          <div className="store-purchases-mobile-search-card">
            <SearchBox
              value={customerSearch}
              onChange={(event) => setCustomerSearch(event.target.value)}
              onCameraClick={openQrScanner}
            />
            <p className="muted">استخدم الكاميرا لقراءة QR أو ابحث يدويًا برقم الهاتف أو الاسم أو الإيميل.</p>
          </div>

          {customerLoading ? (
            <article className="admin-setting-card store-purchases-mobile-state">
              <p className="muted">جارٍ البحث عن العميل...</p>
            </article>
          ) : null}

          {!customerLoading && customerSearch.trim() && !selectedCustomer ? (
            <article className="admin-setting-card store-purchases-mobile-state">
              <p className="muted">
                {customerResults.length ? 'اختر العميل المطلوب من النتائج التالية.' : 'لم يتم العثور على عميل مطابق. جرّب QR آخر أو ابحث بالهاتف أو الاسم.'}
              </p>
              {customerResults.length ? (
                <div className="store-purchases-mobile-results">
                  {customerResults.map((customer) => (
                    <button
                      key={customer._id}
                      type="button"
                      className="customer-care-user-card"
                      onClick={() => setSelectedCustomerId(customer._id)}
                    >
                      <div className="customer-care-user-head">
                        <div className="customer-care-user-avatar">
                          {customer.avatar ? <img src={customer.avatar} alt={customer.name} /> : customer.name?.trim()?.slice(0, 2)?.toUpperCase()}
                        </div>
                        <div>
                          <strong>{customer.name}</strong>
                          <span>{customer.customerCode || 'بدون كود'}</span>
                        </div>
                      </div>
                      <p>{customer.email || 'بدون بريد إلكتروني'}</p>
                      <small>{customer.phone || 'بدون رقم هاتف'}</small>
                    </button>
                  ))}
                </div>
              ) : null}
            </article>
          ) : null}

          {selectedCustomer ? (
            <section className="store-purchases-mobile-customer">
              <article className="store-purchases-mobile-customer-card">
                <div className="customer-care-summary-head">
                  <div className="customer-care-user-avatar large">
                    {selectedCustomer.avatar ? <img src={selectedCustomer.avatar} alt={selectedCustomer.name} /> : selectedCustomer.name?.trim()?.slice(0, 2)?.toUpperCase()}
                  </div>
                  <div>
                    <strong>{selectedCustomer.name}</strong>
                    <span>{selectedCustomer.email || 'بدون بريد إلكتروني'}</span>
                    <small>{selectedCustomer.phone || 'بدون رقم هاتف'}</small>
                  </div>
                </div>

                <div className="customer-care-meta-grid store-purchases-mobile-meta">
                  <div><QrCode size={16} /><span>{selectedCustomer.customerCode || 'بدون QR'}</span></div>
                  <div><Wallet size={16} /><span>{Number(selectedCustomer.walletBalance || 0)} ج.م</span></div>
                  <div><Award size={16} /><span>{Number(selectedCustomer.loyaltyPoints || 0)} نقطة</span></div>
                  <div><Store size={16} /><span>{Number(selectedCustomer.inStoreSpentTotal || 0)} ج.م مشتريات محل</span></div>
                </div>

                <button
                  type="button"
                  className="store-purchases-mobile-reset"
                  onClick={() => {
                    setCustomerSearch('');
                    setCustomerResults([]);
                    setSelectedCustomerId('');
                    setStorePurchaseForm(emptyStorePurchaseForm);
                  }}
                >
                  تغيير العميل
                </button>
              </article>

              <form className="admin-setting-card store-purchases-mobile-form" onSubmit={submitStorePurchase}>
                <div className="customer-care-card-head">
                  <Store size={18} />
                  <strong>تسجيل شراء جديد من المحل</strong>
                </div>

                <label className="admin-field">
                  <span className="admin-field-label">مبلغ الشراء</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={storePurchaseForm.amount}
                    onChange={(event) => setStorePurchaseForm((current) => ({ ...current, amount: event.target.value }))}
                    placeholder="0"
                  />
                </label>

                <label className="admin-field">
                  <span className="admin-field-label">ملاحظة</span>
                  <input
                    value={storePurchaseForm.note}
                    onChange={(event) => setStorePurchaseForm((current) => ({ ...current, note: event.target.value }))}
                    placeholder="مثال: فاتورة من الفرع"
                  />
                </label>

                <p className="muted">سيتم إضافة نفس قيمة المبلغ تقريبًا كنقاط ولاء لهذا العميل.</p>

                <button type="submit" className="primary-btn store-purchases-mobile-submit" disabled={submitting}>
                  <Save size={16} />
                  <span>{submitting ? 'جارٍ الحفظ...' : 'تسجيل الشراء'}</span>
                </button>
              </form>
            </section>
          ) : null}
        </section>
      </section>

      {qrScannerOpen ? (
        <div className="barcode-scanner-overlay" onClick={closeQrScanner}>
          <div className="barcode-scanner-modal" onClick={(event) => event.stopPropagation()}>
            <div className="barcode-scanner-head">
              <div>
                <strong>قراءة QR بالكاميرا</strong>
                <span>{qrScannerStatus || 'جارٍ تجهيز الكاميرا...'}</span>
              </div>
              <button type="button" className="barcode-scanner-close" onClick={closeQrScanner} aria-label="إغلاق">
                <X size={18} />
              </button>
            </div>

            <div className="barcode-scanner-frame">
              <video ref={qrVideoRef} className="barcode-scanner-video" playsInline muted autoPlay />
              <div className="barcode-scanner-target" />
            </div>

            {!qrScannerStarting ? (
              <button type="button" className="primary-btn barcode-scanner-allow" onClick={requestQrScanner}>
                السماح بالكاميرا
              </button>
            ) : null}

            <button type="button" className="secondary-btn barcode-scanner-cancel" onClick={closeQrScanner}>
              إلغاء
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
