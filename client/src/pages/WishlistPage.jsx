import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function WishlistPage() {
  const { items } = useWishlist();

  const stats = useMemo(() => ({
    count: items.length,
    discounted: items.filter(item => item.oldPrice > item.price).length,
  }), [items]);

  return <main className="app-shell home-screen market-home account-page-shell">
    <section className="panel-card account-hero">
      <div className="account-hero-main">
        <div className="account-icon-badge">
          <Heart size={28} />
        </div>
        <div className="account-copy">
          <span className="market-pill">المفضلة</span>
          <h1>منتجاتك المفضلة</h1>
          <p>كل المنتجات التي حفظتها في مكان واحد، لتعود لها بسرعة وقت ما تحتاج.</p>
        </div>
      </div>
      <div className="account-hero-actions">
        <Link to="/offers" className="secondary-btn">العروض</Link>
        <Link to="/" className="primary-btn">العودة للتسوق</Link>
      </div>
    </section>

    <section className="account-stats-grid">
      <article className="account-stat-card">
        <span>إجمالي المنتجات</span>
        <strong>{stats.count}</strong>
      </article>
      <article className="account-stat-card">
        <span>منتجات عليها خصم</span>
        <strong>{stats.discounted}</strong>
      </article>
      <article className="account-stat-card">
        <span>جاهزة للمراجعة</span>
        <strong>{stats.count ? 'نعم' : 'لا'}</strong>
      </article>
    </section>

    <section className="panel-card account-content-panel">
      <div className="section-head compact">
        <h2>قائمة المفضلة</h2>
        <span>{items.length} منتج</span>
      </div>

      {items.length ? <div className="category-products-grid">
        {items.map(product => <ProductCard key={`wishlist-${product._id}`} product={product} />)}
      </div> : <div className="account-empty-state">
        <div className="account-empty-icon">
          <Sparkles size={26} />
        </div>
        <strong>لا توجد منتجات مفضلة حتى الآن</strong>
        <p>ابدأ بحفظ المنتجات التي تنال إعجابك لتظهر هنا بشكل منظم وسهل الوصول.</p>
        <div className="account-empty-actions">
          <Link to="/" className="primary-btn"><ShoppingBag size={16} /> ابدأ التسوق</Link>
          <Link to="/categories" className="secondary-btn">تصفح الفئات</Link>
        </div>
      </div>}
    </section>
  </main>;
}
