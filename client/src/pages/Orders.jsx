import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock3, PackageCheck, ShoppingBag } from 'lucide-react';
import api from '../api/api.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/orders/my')
      .then(({ data }) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    count: orders.length,
    latest: orders[0]?.status || 'لا يوجد',
    total: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
  }), [orders]);

  return <main className="app-shell home-screen market-home account-page-shell">
    <section className="panel-card account-hero">
      <div className="account-hero-main">
        <div className="account-icon-badge">
          <ClipboardList size={28} />
        </div>
        <div className="account-copy">
          <span className="market-pill">الطلبات</span>
          <h1>طلباتي</h1>
          <p>متابعة واضحة لكل طلباتك السابقة والحالية مع حالة كل طلب في مكان واحد.</p>
        </div>
      </div>
      <div className="account-hero-actions">
        <Link to="/wishlist" className="secondary-btn">المفضلة</Link>
        <Link to="/" className="primary-btn">العودة للتسوق</Link>
      </div>
    </section>

    <section className="account-stats-grid">
      <article className="account-stat-card">
        <span>عدد الطلبات</span>
        <strong>{stats.count}</strong>
      </article>
      <article className="account-stat-card">
        <span>آخر حالة</span>
        <strong>{stats.latest}</strong>
      </article>
      <article className="account-stat-card">
        <span>إجمالي المشتريات</span>
        <strong>{stats.total} ج.م</strong>
      </article>
    </section>

    <section className="panel-card account-content-panel">
      <div className="section-head compact">
        <h2>سجل الطلبات</h2>
        <span>{loading ? 'جاري التحميل...' : `${orders.length} طلب`}</span>
      </div>

      {loading ? <p className="muted">جاري تحميل الطلبات...</p> : orders.length ? <div className="orders-timeline">
        {orders.map(order => <article className="order-showcase-card" key={order._id}>
          <div className="order-showcase-top">
            <div>
              <strong>طلب #{order._id.slice(-6)}</strong>
              <p>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
            </div>
            <span className="order-status-pill"><Clock3 size={14} /> {order.status}</span>
          </div>

          <div className="order-showcase-bottom">
            <div className="order-meta-box">
              <PackageCheck size={18} />
              <div>
                <span>قيمة الطلب</span>
                <strong>{order.totalPrice} ج.م</strong>
              </div>
            </div>
            <div className="order-meta-box">
              <ShoppingBag size={18} />
              <div>
                <span>الملخص</span>
                <strong>طلب جاهز للمتابعة</strong>
              </div>
            </div>
          </div>
        </article>)}
      </div> : <div className="account-empty-state">
        <div className="account-empty-icon">
          <ClipboardList size={26} />
        </div>
        <strong>لا توجد طلبات حتى الآن</strong>
        <p>عند إتمام أول طلب ستظهر هنا حالة الطلبات وتفاصيلها بشكل منظم.</p>
        <div className="account-empty-actions">
          <Link to="/" className="primary-btn"><ShoppingBag size={16} /> ابدأ التسوق</Link>
          <Link to="/offers" className="secondary-btn">شاهد العروض</Link>
        </div>
      </div>}
    </section>
  </main>;
}
