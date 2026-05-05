import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

export default function ContactPage() {
  const { settings } = useStoreSettings();

  return <main className="app-shell home-screen market-home category-page-shell">
    <section className="panel-card category-page-hero">
      <div className="section-head">
        <div>
          <span className="market-pill">تواصل معنا</span>
          <h1>تواصل معنا</h1>
          <p>نسعد دائمًا باستفساراتك وملاحظاتك، ويمكنك التواصل معنا من خلال القنوات التالية.</p>
        </div>
        <Link to="/" className="secondary-btn">العودة للرئيسية</Link>
      </div>
    </section>

    <section className="panel-card profile-details-grid">
      <div className="profile-detail-card">
        <strong>رقم الهاتف</strong>
        <span>{settings?.supportPhone || '-'}</span>
      </div>
      <div className="profile-detail-card">
        <strong>البريد الإلكتروني</strong>
        <span>{settings?.supportEmail || '-'}</span>
      </div>
      <div className="profile-detail-card">
        <strong>العنوان</strong>
        <span>{settings?.address || '-'}</span>
      </div>
    </section>

    <section className="panel-card profile-links-grid">
      <div className="profile-link-card">
        <strong>مواعيد العمل</strong>
        <span>{settings?.workingHours || '-'}</span>
      </div>
      <div className="profile-link-card">
        <strong>واتساب</strong>
        <span>{settings?.whatsapp || 'غير متوفر حاليًا'}</span>
      </div>
      <div className="profile-link-card">
        <strong>اسم المتجر</strong>
        <span>{settings?.storeName || 'Al Wekala Market'}</span>
      </div>
    </section>
  </main>;
}
