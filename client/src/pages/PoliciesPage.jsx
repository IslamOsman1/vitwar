import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Truck, Undo2 } from 'lucide-react';
import { policySummaries } from '../data/policies.js';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';

const iconMap = {
  privacy: ShieldCheck,
  terms: FileText,
  shipping: Truck,
  refund: Undo2
};

export default function PoliciesPage() {
  const { settings } = useStoreSettings();
  const policies = settings?.policies || {};

  return (
    <main className="app-shell home-screen market-home category-page-shell">
      <section className="panel-card category-page-hero">
        <div className="section-head">
          <div>
            <span className="market-pill">السياسات</span>
            <h1>مركز السياسات</h1>
            <p>جميع السياسات الأساسية الخاصة بالخصوصية والطلبات والشحن والاسترجاع في مكان واحد.</p>
          </div>
          <Link to="/" className="secondary-btn">العودة للرئيسية</Link>
        </div>
      </section>

      <section className="panel-card policy-grid">
        {policySummaries.map((policy) => {
          const Icon = iconMap[policy.key] || FileText;
          const policyContent = policies[policy.key];
          return (
            <Link key={policy.key} to={policy.path} className="policy-card">
              <span className="policy-card-icon"><Icon size={22} /></span>
              <strong>{policyContent?.title || policy.title}</strong>
              <p>{policyContent?.description || policy.description}</p>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
