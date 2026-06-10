import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppSplash from './components/AppSplash.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import SiteNotificationPrompt from './components/SiteNotificationPrompt.jsx';
import SupportChatWidget from './components/SupportChatWidget.jsx';
import { ensurePushSubscription } from './utils/pushNotifications.js';
import { useAuth } from './context/AuthContext.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'));
const OffersPage = lazy(() => import('./pages/OffersPage.jsx'));
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const PoliciesPage = lazy(() => import('./pages/PoliciesPage.jsx'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.jsx'));
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage.jsx'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage.jsx'));
const VitwarPicksPage = lazy(() => import('./pages/VitwarPicksPage.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const CheckoutReview = lazy(() => import('./pages/CheckoutReview.jsx'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const StorePurchasesPage = lazy(() => import('./pages/StorePurchasesPage.jsx'));

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const { user } = useAuth();
  const [bootSplashVisible, setBootSplashVisible] = useState(true);
  const [routeSplashVisible, setRouteSplashVisible] = useState(false);
  const firstPathRef = useRef(location.pathname);

  useEffect(() => {
    document.body.dataset.theme = 'dark';
    localStorage.removeItem('theme');
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const isSmallScreen = window.matchMedia?.('(max-width: 480px)')?.matches;
    const splashDuration = prefersReducedMotion || isSmallScreen ? 800 : 1500;
    const timer = window.setTimeout(() => setBootSplashVisible(false), splashDuration);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (firstPathRef.current === location.pathname) return;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const isSmallScreen = window.matchMedia?.('(max-width: 480px)')?.matches;
    if (prefersReducedMotion || isSmallScreen) {
      setRouteSplashVisible(false);
      return undefined;
    }
    setRouteSplashVisible(true);
    const timer = window.setTimeout(() => setRouteSplashVisible(false), 420);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    firstPathRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const isSmallScreen = window.matchMedia?.('(max-width: 480px)')?.matches;
    window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion || isSmallScreen ? 'auto' : 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    if (!user || typeof window === 'undefined' || !('Notification' in window)) return;
    if (window.Notification.permission !== 'granted') return;
    ensurePushSubscription().catch(() => undefined);
  }, [user]);

  return <div className="app-root">
    <AppSplash visible={bootSplashVisible || routeSplashVisible} routeChanging={!bootSplashVisible && routeSplashVisible} />
    <Header />
    <SiteNotificationPrompt />
    <main className={`app-main-shell${routeSplashVisible ? ' is-transitioning' : ''}`}>
      <Suspense fallback={<div className="page route-loading"><p className="muted">جارٍ تحميل الصفحة...</p></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/vitwar-picks" element={<VitwarPicksPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/policies/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/policies/terms" element={<TermsPage />} />
          <Route path="/policies/shipping" element={<ShippingPolicyPage />} />
          <Route path="/policies/refund" element={<RefundPolicyPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/review" element={<CheckoutReview />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/store-purchases" element={<AdminRoute><StorePurchasesPage /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </main>
    <SupportChatWidget />
    <Footer />
  </div>;
}
