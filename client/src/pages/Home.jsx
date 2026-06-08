import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  Truck
} from 'lucide-react';
import api from '../api/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { useStoreSettings } from '../context/StoreSettingsContext.jsx';
import { getCategoryGroups } from '../utils/categoryHelpers.js';

const categoryCards = [
  { title: 'سمـاش برجر', category: 'برجر', subtitle: 'برجر مشوي بطعم غني', emoji: '🍔' },
  { title: 'فرايد تشيكن', category: 'فرايد تشيكن', subtitle: 'قطع كريسبي وتتبيلات خاصة', emoji: '🍗' },
  { title: 'كومبو ووجبات', category: 'كومبو', subtitle: 'وجبات كاملة وسريعة', emoji: '🥤' },
  { title: 'مقبلات وصوصات', category: 'مقبلات', subtitle: 'إضافات تكمل الطلب', emoji: '🍟' }
];

const serviceCards = [
  { title: 'تجهيز سريع', icon: <Clock3 size={22} /> },
  { title: 'طعم مشوي طازج', icon: <Flame size={22} /> },
  { title: 'توصيل حتى بابك', icon: <Truck size={22} /> }
];

const fallbackSlides = [
  {
    id: 'promo-1',
    title: 'سمـاش برجر بطبقتين ولحم مشوي على الجريل',
    tag: 'الأكثر طلبًا',
    note: 'عيش محمص، صوص الخواجة، وجبن سايح في كل قضمة.',
    accentClass: 'promo-red'
  },
  {
    id: 'promo-2',
    title: 'فرايد تشيكن مقرمش بخلطة مطبخ الخواجة',
    tag: 'كريسبي',
    note: 'قطع دجاج ذهبية مقرمشة مع صوصات واختيارات جانبية.',
    accentClass: 'promo-gold'
  },
  {
    id: 'promo-3',
    title: 'وجبات وكومبوهات جاهزة للّمة والجوع السريع',
    tag: 'وفر أكثر',
    note: 'اختر الوجبة المناسبة واضف البطاطس والمشروب بسهولة.',
    accentClass: 'promo-dark'
  }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showAllExploreCategories, setShowAllExploreCategories] = useState(false);
  const { settings } = useStoreSettings();
  const categoryGroups = useMemo(() => getCategoryGroups(settings), [settings]);

  useEffect(() => {
    setLoading(true);
    api.get('/products')
      .then(({ data }) => setProducts(Array.isArray(data.products) ? data.products : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const heroSlides = useMemo(() => {
    const adminSlides = settings?.home?.heroSlides?.filter((slide) => slide?.title || slide?.image);
    if (adminSlides?.length) {
      return adminSlides.map((slide, index) => ({
        id: `admin-slide-${index}`,
        title: slide.title,
        tag: slide.tag || 'مميز',
        note: slide.note,
        image: slide.image,
        link: slide.link || '/offers'
      }));
    }

    const imageProducts = products.filter((product) => product.image?.url).slice(0, 3);
    if (imageProducts.length) {
      return imageProducts.map((product, index) => ({
        id: product._id,
        title: product.name,
        tag: index === 0 ? 'ترشيح الشيف' : index === 1 ? 'عرض اليوم' : 'جديد المنيو',
        note: product.oldPrice > product.price ? `الآن بسعر ${product.price} ج.م` : product.description || product.category,
        image: product.image?.url,
        link: `/product/${product._id}`
      }));
    }

    return fallbackSlides;
  }, [products, settings]);

  useEffect(() => {
    if (!heroSlides.length) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [heroSlides]);

  useEffect(() => {
    setActiveSlide((current) => (current >= heroSlides.length ? 0 : current));
  }, [heroSlides]);

  const slide = heroSlides[activeSlide] || fallbackSlides[0];
  const bestSellers = products.filter((product) => product.isDeal || product.featured).slice(0, 8);
  const featuredCategories = settings?.home?.featuredCategories?.length ? settings.home.featuredCategories : categoryCards;

  const exploreCategories = useMemo(() => {
    const featuredLookup = new Map(featuredCategories.map((item) => [item.category || item.title, item]));

    return categoryGroups.map((group) => {
      const sourceCategories = (group.sections || []).map((section) => section.sourceCategory).filter(Boolean);
      const featuredMatch = sourceCategories
        .map((sourceCategory) => featuredLookup.get(sourceCategory))
        .find(Boolean) || featuredLookup.get(group.title);
      const productImage = products.find((product) => sourceCategories.includes(product.category) && product.image?.url)?.image?.url;

      return {
        title: group.title,
        target: group.title,
        image: featuredMatch?.image || productImage || ''
      };
    });
  }, [categoryGroups, featuredCategories, products]);

  const visibleExploreCategories = showAllExploreCategories ? exploreCategories : exploreCategories.slice(0, 4);
  const hasMoreExploreCategories = exploreCategories.length > 4;

  return <main className="app-shell home-screen market-home">
    <section className={`market-hero image-promo-hero ${slide.accentClass || ''}`}>
      <button type="button" className="slider-arrow next" onClick={() => setActiveSlide((current) => (current + 1) % heroSlides.length)} aria-label="التالي">
        <ChevronRight size={22} />
      </button>
      <button type="button" className="slider-arrow prev" onClick={() => setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)} aria-label="السابق">
        <ChevronLeft size={22} />
      </button>

      <Link
        to={slide.link || '/offers'}
        className="promo-slide-frame"
        style={slide.image ? { backgroundImage: `linear-gradient(180deg, rgba(9,9,9,.16), rgba(9,9,9,.56)), url(${slide.image})` } : undefined}
      >
        <span className="promo-slide-tag">{slide.tag}</span>
      </Link>

      <div className="slider-dots hero-dots">
        {heroSlides.map((item, index) => <button
          key={item.id}
          type="button"
          className={index === activeSlide ? 'active' : ''}
          onClick={() => setActiveSlide(index)}
          aria-label={`اذهب إلى الشريحة ${index + 1}`}
        />)}
      </div>
    </section>

    <section className="service-strip">
      {serviceCards.map((item) => <div key={item.title}>{item.icon} {item.title}</div>)}
    </section>

    <section className="panel-card market-categories" id="featured">
      <div className="section-head compact">
        <h2>أقسام المنيو</h2>
        <span>ابدأ من القسم المناسب ثم أضف الساندوتش أو الوجبة أو الإضافات مباشرة إلى السلة.</span>
      </div>
      <div className="market-category-grid">
        {featuredCategories.map((item) => <Link
          to={`/category/${encodeURIComponent(item.category)}`}
          key={item.title}
          className={`market-category-card${item.image ? ' visual' : ''}`}
          style={item.image ? { '--category-image': `url(${item.image})` } : undefined}
        >
          {!item.image && item.emoji ? <span className="market-category-emoji" aria-hidden="true">{item.emoji}</span> : null}
          <strong>{item.title}</strong>
          <small>{item.subtitle}</small>
        </Link>)}
      </div>
    </section>

    <section className="panel-card products-panel" id="products">
      <div className="section-head">
        <div>
          <h2>ترشيحات الخواجة</h2>
          <p>أطباق وسندوتشات عليها طلب كبير ويمكنك البدء بها لو أردت أسرع اختيار من المنيو.</p>
        </div>
        <Link to="/categories" className="section-link">افتح المنيو كاملًا</Link>
      </div>

      {loading ? <p className="muted">جاري تحميل المنتجات...</p> : <div className="product-sections">
        {!!bestSellers.length && <section className="product-section">
          <div className="products-grid">{bestSellers.map((product) => <ProductCard key={`best-${product._id}`} product={product} />)}</div>
        </section>}
        {!bestSellers.length && <p className="muted">لا توجد منتجات مميزة حاليًا لهذا القسم.</p>}
      </div>}
    </section>

    <section className="panel-card explore-categories-panel" id="explore-categories">
      <div className="explore-categories-head">
        <h2>استكشف فئات الطلب</h2>
        <p>تنقل بين مجموعات المنيو مثل البرجر، الكومبو، الفرايد تشيكن، والمقبلات حسب إعدادات المطعم الحالية.</p>
      </div>

      <div className="explore-categories-grid">
        {visibleExploreCategories.map((item) => <Link
          to={`/category/${encodeURIComponent(item.target)}`}
          key={item.title}
          className="explore-category-card"
        >
          <strong>{item.title}</strong>
          <div className="explore-category-image-wrap">
            {item.image ? <img src={item.image} alt={item.title} className="explore-category-image" loading="lazy" /> : <span className="explore-category-fallback">{item.title}</span>}
          </div>
        </Link>)}
      </div>

      {hasMoreExploreCategories ? <div className="explore-categories-more">
        <button
          type="button"
          className="explore-more-btn"
          onClick={() => setShowAllExploreCategories((current) => !current)}
        >
          {showAllExploreCategories ? 'إخفاء' : 'المزيد'}
        </button>
      </div> : null}
    </section>
  </main>;
}
