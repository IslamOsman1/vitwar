import React from 'react';
import { Link } from 'react-router-dom';
import { defaultPoliciesContent } from '../data/policies.js';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

export default function RefundPolicyPage() {
  const { settings } = useStoreSettings();
  const policy = settings?.policies?.refund || defaultPoliciesContent.refund;

  return (
    <main className="app-shell home-screen market-home category-page-shell">
      <section className="panel-card category-page-hero">
        <div className="section-head">
          <div>
            <span className="market-pill">{policy.title}</span>
            <h1>{policy.title}</h1>
            <p>{policy.description}</p>
          </div>
          <Link to="/policies" className="secondary-btn">جميع السياسات</Link>
        </div>
      </section>

      <section className="panel-card policy-sections">
        {(policy.sections || []).map((section) => (
          <article key={section.title} className="policy-section-card">
            <h2>{section.title}</h2>
            {'items' in section
              ? <ul className="policy-list">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
              : <p className="policy-paragraph">{section.body}</p>}
          </article>
        ))}
      </section>
    </main>
  );
}
