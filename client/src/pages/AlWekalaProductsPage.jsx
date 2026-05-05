import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';
import ProductCard from '../components/ProductCard.jsx';

export default function AlWekalaProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/products?limit=100')
      .then(({ data }) => setProducts(Array.isArray(data.products) ? data.products : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const agencyProducts = useMemo(() => {
    const featuredProducts = products.filter((product) => product.featured);
    return featuredProducts.length ? featuredProducts : products;
  }, [products]);

  return <main className="app-shell home-screen market-home category-page-shell">
    <section className="panel-card category-page-hero">
      <div className="section-head">
        <div>
          <span className="market-pill">منتجات الوكالة</span>
          <h1>منتجات الوكالة</h1>
          <p>صفحة مخصصة لعرض المنتجات المميزة الخاصة بالوكالة، ويتم التحكم فيها من لوحة التحكم عبر خيار المنتج المميز.</p>
        </div>
        <Link to="/" className="secondary-btn">العودة للرئيسية</Link>
      </div>
    </section>

    <section className="panel-card products-panel category-products-panel">
      <div className="section-head compact">
        <h2>كل المنتجات</h2>
        <span>{loading ? 'جاري التحميل...' : `${agencyProducts.length} منتج`}</span>
      </div>

      {loading ? <p className="muted">جاري تحميل المنتجات...</p> : agencyProducts.length ? <div className="category-products-grid">
        {agencyProducts.map((product) => <ProductCard key={`agency-${product._id}`} product={product} />)}
      </div> : <div className="empty-state">
        <p>لا توجد منتجات متاحة حاليًا في هذا القسم.</p>
        <Link to="/admin" className="primary-btn">اذهب إلى لوحة التحكم</Link>
      </div>}
    </section>
  </main>;
}
