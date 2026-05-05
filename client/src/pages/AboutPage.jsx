import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

export default function AboutPage() {
  const { settings } = useStoreSettings();
  const about = settings?.about || {};

  return <main className="app-shell home-screen market-home category-page-shell">
    <section className="panel-card category-page-hero">
      <div className="section-head">
        <div>
          <span className="market-pill">{about.title || 'من نحن'}</span>
          <h1>{about.title || 'من نحن'}</h1>
          <p>{about.description}</p>
        </div>
        <Link to="/" className="secondary-btn">العودة للرئيسية</Link>
      </div>
    </section>

    <section className="panel-card profile-links-grid">
      <div className="profile-link-card">
        <strong>رؤيتنا</strong>
        <span>{about.vision}</span>
      </div>
      <div className="profile-link-card">
        <strong>رسالتنا</strong>
        <span>{about.mission}</span>
      </div>
      <div className="profile-link-card">
        <strong>قيمنا</strong>
        <span>{about.values}</span>
      </div>
    </section>
  </main>;
}
