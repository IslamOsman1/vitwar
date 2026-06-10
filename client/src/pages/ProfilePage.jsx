import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import {
  LogOut,
  Mail,
  Phone,
  QrCode,
  ShieldCheck,
  ShoppingCart,
  TicketPercent,
  UserRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [qrImage, setQrImage] = useState('');

  const displayName = user?.name || 'مستخدم الموقع';
  const initials = displayName.trim().slice(0, 2).toUpperCase();
  const activePrivateCodes = Array.isArray(user?.privateDiscountCodes) ? user.privateDiscountCodes : [];
  const accountRole = user?.role === 'admin' ? 'مدير' : user?.role === 'employee' ? 'موظف' : 'عميل';

  const quickStats = [
    { label: 'حالة الحساب', value: accountRole, icon: ShieldCheck },
    { label: 'أكواد الخصم', value: activePrivateCodes.length, icon: TicketPercent },
    { label: 'بيانات التواصل', value: user?.phone ? 'مكتملة' : 'بحاجة للتحديث', icon: Phone }
  ];

  const infoCards = [
    { label: 'الاسم', value: user?.name || 'غير متوفر', icon: UserRound },
    { label: 'البريد الإلكتروني', value: user?.email || 'غير متوفر', icon: Mail },
    { label: 'رقم الهاتف', value: user?.phone || 'غير متوفر', icon: Phone },
    { label: 'نوع الحساب', value: accountRole, icon: ShieldCheck }
  ];

  const quickLinks = [
    {
      to: '/cart',
      label: 'السلة',
      note: 'أكمل العناصر الجاهزة للشراء بسرعة',
      icon: ShoppingCart,
      tone: 'gold'
    }
  ];

  useEffect(() => {
    const qrValue = user?.qrCodeValue || user?.customerCode || '';
    if (!qrValue) {
      setQrImage('');
      return;
    }

    QRCode.toDataURL(qrValue, {
      margin: 1,
      width: 220,
      color: {
        dark: '#111111',
        light: '#fffaf2'
      }
    })
      .then(setQrImage)
      .catch(() => setQrImage(''));
  }, [user?.customerCode, user?.qrCodeValue]);

  return (
    <main className="app-shell home-screen market-home account-page-shell profile-page-modern">
      <section className="panel-card profile-hero-modern">
        <div className="profile-hero-backdrop" />

        <div className="profile-hero-layout">
          <div className="profile-hero-main">
            <div className="profile-avatar-modern">
              {user?.avatar ? (
                <img src={user.avatar} alt={displayName} className="profile-avatar-large-image" />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className="profile-hero-copy">
              <span className="market-pill">الملف الشخصي</span>
              <h1>{displayName}</h1>
              <p>لوحة حساب عصرية بتفاصيلك المهمة، كود العميل، وأسرع طريق لطلباتك ومفضلتك داخل تجربة المطعم الجديدة.</p>

              <div className="profile-hero-tags">
                <span>{accountRole}</span>
                <span>{user?.customerCode || 'بدون كود عميل'}</span>
                <span>{activePrivateCodes.length} كود خصم</span>
              </div>
            </div>
          </div>

          <div className="profile-hero-actions-modern">
            <Link to="/cart" className="primary-btn">السلة</Link>
            <Link to="/" className="secondary-btn">الرئيسية</Link>
            <button type="button" className="secondary-btn profile-logout-btn" onClick={logout}>
              <LogOut size={16} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        <div className="profile-stat-band">
          {quickStats.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="profile-stat-tile">
                <span className="profile-stat-icon"><Icon size={18} /></span>
                <div>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="profile-content-grid">
        <section className="profile-main-column">
          <section className="panel-card profile-section-card">
            <div className="section-head compact">
              <h2>معلومات الحساب</h2>
              <span>بياناتك الأساسية</span>
            </div>

            <div className="profile-info-grid-modern">
              {infoCards.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.label} className="profile-info-card-modern">
                    <span className="profile-info-icon-modern"><Icon size={18} /></span>
                    <div>
                      <small>{item.label}</small>
                      <strong>{item.value}</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="profile-identity-grid-modern">
            <article className="panel-card profile-qr-card-modern">
              <div className="profile-block-head">
                <div>
                  <strong>QR العميل</strong>
                  <span>أظهر الرمز عند الكاشير أو الدعم للوصول السريع إلى حسابك.</span>
                </div>
                <span className="profile-block-icon"><QrCode size={18} /></span>
              </div>

              <div className="profile-qr-box-modern">
                {qrImage ? <img src={qrImage} alt={`QR ${user?.customerCode || ''}`} /> : <div className="profile-qr-empty">QR</div>}
              </div>

              <div className="profile-code-ribbon">
                <small>كود العميل</small>
                <strong>{user?.customerCode || 'غير متوفر'}</strong>
              </div>
            </article>

            <article className="panel-card profile-discount-card-modern">
              <div className="profile-block-head">
                <div>
                  <strong>أكوادك الخاصة</strong>
                  <span>أكواد خصم مرتبطة بحسابك ويمكن استخدامها أثناء الشراء.</span>
                </div>
                <span className="profile-block-icon"><TicketPercent size={18} /></span>
              </div>

              <div className="profile-private-codes-modern">
                {activePrivateCodes.length ? activePrivateCodes.map((item) => (
                  <article key={item._id || item.code} className="profile-private-code-modern">
                    <div className="profile-private-code-top">
                      <strong>{item.code}</strong>
                      <span>{item.type === 'percent' ? 'خصم نسبي' : 'خصم ثابت'}</span>
                    </div>
                    <p>
                      {item.type === 'percent' ? `${Number(item.value || 0)}% خصم` : `${Number(item.value || 0)} ج.م خصم`}
                      {Number(item.minOrderAmount || 0) > 0 ? ` • حد أدنى ${Number(item.minOrderAmount || 0)} ج.م` : ''}
                    </p>
                  </article>
                )) : (
                  <div className="profile-private-code-empty">لا توجد أكواد خصم خاصة مفعلة حاليًا.</div>
                )}
              </div>
            </article>
          </section>
        </section>

        <aside className="panel-card profile-side-panel">
          <div className="section-head compact">
            <h2>وصول سريع</h2>
            <span>اختصارات يومية</span>
          </div>

          <div className="profile-quick-links-modern">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to} className={`profile-quick-link-modern tone-${item.tone}`}>
                  <span className="profile-quick-link-icon"><Icon size={18} /></span>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.note}</span>
                  </div>
                </Link>
              );
            })}

            <button type="button" className="profile-quick-link-modern tone-outline profile-quick-link-button" onClick={logout}>
              <span className="profile-quick-link-icon"><LogOut size={18} /></span>
              <div>
                <strong>تسجيل الخروج</strong>
                <span>إنهاء الجلسة الحالية من الحساب</span>
              </div>
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
