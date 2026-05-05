import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart, UserRound, LayoutDashboard, LogOut, Search, Moon, Sun } from 'lucide-react';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function Header({ theme, onToggleTheme }) {
  const { user, logout } = useAuth();
  const { count } = useWishlist();

  const displayName = user?.name || 'User';
  const initials = displayName.trim().slice(0, 2).toUpperCase();

  return <header className="site-header">
    <div className="app-shell header-shell">
      <div className="header-card">
        <Link to="/" className="brand" aria-label="Al Wekala Market">
          <Logo compact />
        </Link>

        <div className="search-box">
          <Search size={24} />
          <input placeholder="ابحث عن منتجات، عروض، فئات..." />
        </div>

        <div className="header-actions">
          <NavLink to="/wishlist" className="round-action cart-link" title="المفضلة" aria-label="المفضلة">
            <Heart size={22} />
            {count > 0 && <b>{count}</b>}
          </NavLink>

          <button
            type="button"
            className="round-action theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
            aria-label={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
          >
            {theme === 'dark' ? <Sun size={21} /> : <Moon size={21} />}
          </button>

          {user?.role === 'admin' && <NavLink to="/admin" className="round-action" title="لوحة التحكم">
            <LayoutDashboard size={22} />
          </NavLink>}

          {user
            ? <button className="round-action" onClick={logout} title="تسجيل الخروج"><LogOut size={22} /></button>
            : <NavLink to="/login" className="round-action user-action" title="تسجيل الدخول"><UserRound size={22} /></NavLink>}

          {user && <NavLink to="/profile" className="profile-avatar-trigger" title="الملف الشخصي" aria-label="الملف الشخصي">
            {user.avatar ? <img src={user.avatar} alt={displayName} className="profile-avatar-image" /> : initials}
          </NavLink>}
        </div>
      </div>
    </div>
  </header>;
}
