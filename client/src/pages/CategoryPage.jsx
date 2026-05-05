import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';
import { getCategoryGroups, resolveCategoryTargetFromGroups } from '../utils/categoryHelpers.js';

const directCategoryMeta = {
  خضار: {
    title: 'قسم الخضار',
    subtitle: 'خضار يومية مختارة بعناية لتوصلك طازجة وسهلة الطلب.'
  },
  فاكهة: {
    title: 'قسم الفاكهة',
    subtitle: 'فاكهة طازجة ومنوعة تناسب الطلب اليومي والعائلي.'
  },
  ألبان: {
    title: 'قسم الألبان',
    subtitle: 'منتجات ألبان مبردة ومنظمة لعرض أوضح وتجربة أسرع.'
  },
  بقالة: {
    title: 'قسم البقالة',
    subtitle: 'كل احتياجات البيت الأساسية في صفحة واحدة مرتبة.'
  }
};

export default function CategoryPage() {
  const { name = '' } = useParams();
  const categoryName = useMemo(() => decodeURIComponent(name), [name]);
  const { settings } = useStoreSettings();
  const categoryGroups = useMemo(() => getCategoryGroups(settings), [settings]);
  const resolvedTarget = useMemo(() => resolveCategoryTargetFromGroups(categoryGroups, categoryName), [categoryGroups, categoryName]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const sourceCategory = resolvedTarget?.sourceCategory || categoryName;
    const query = resolvedTarget?.parentTitle
      ? `/products?category=${encodeURIComponent(sourceCategory)}&subcategory=${encodeURIComponent(categoryName)}&limit=100`
      : `/products?category=${encodeURIComponent(sourceCategory)}&limit=100`;

    api.get(query)
      .then(({ data }) => setProducts(Array.isArray(data.products) ? data.products : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categoryName, resolvedTarget]);

  const meta = resolvedTarget || directCategoryMeta[categoryName] || {
    title: categoryName,
    subtitle: 'تصفح المنتجات المتاحة داخل هذه الفئة.'
  };

  return <main className="app-shell home-screen market-home category-page-shell">
    <section className="panel-card category-page-hero">
      <div className="section-head">
        <div>
          <span className="market-pill">الفئات</span>
          <h1>{meta.title}</h1>
          <p>{meta.subtitle}</p>
        </div>
        <Link to="/categories" className="secondary-btn">كل الفئات</Link>
      </div>
    </section>

    {!!meta.sections?.length && <section className="panel-card category-subsections-panel">
      <div className="section-head compact">
        <h2>الأقسام</h2>
        <span>اختر القسم الأقرب لما تبحث عنه</span>
      </div>
      <div className="category-section-list">
        {meta.sections.map((section) => <Link
          key={section.title}
          to={`/category/${encodeURIComponent(section.title)}`}
          className={`category-section-chip${section.title === meta.title ? ' active' : ''}`}
        >
          {section.title}
        </Link>)}
      </div>
    </section>}

    <section className="panel-card products-panel category-products-panel">
      <div className="section-head compact">
        <h2>{meta.title}</h2>
        <span>{loading ? 'جاري التحميل...' : `${products.length} منتج`}</span>
      </div>

      {loading ? <p className="muted">جاري تحميل المنتجات...</p> : products.length ? <div className="category-products-grid">
        {products.map((product) => <ProductCard key={`${meta.title}-${product._id}`} product={product} />)}
      </div> : <div className="empty-state">
        <p>لا توجد منتجات متاحة في هذا القسم حاليًا.</p>
        <Link to="/categories" className="primary-btn">العودة للفئات</Link>
      </div>}
    </section>
  </main>;
}
