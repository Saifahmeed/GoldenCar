import React, { useState, useEffect } from 'react';
import { ShoppingBag, Car, ChevronDown, Sun, Moon, Menu, X, Lock } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../data/i18n.jsx';


export default function Header({
  activeVehicle,
  cartCount,
  onGarageClick,
  onCartClick,
  activeTab,
  setActiveTab,
  onOwnerAccess,
  theme,
  onThemeToggle
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const { t, lang, setLang, isAr } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [activeTab]);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navItems = [
    { id: 'home', tab: 'catalog', label: t('nav.home') },
    { id: 'products', tab: 'catalog', label: t('nav.products') },
    { id: 'offers', tab: 'offers', label: t('nav.offers') },
    { id: 'about', tab: 'about', label: t('nav.about') },
    { id: 'support', tab: 'support', label: t('nav.support') },
    { id: 'contact', tab: 'catalog', label: t('nav.contact') },
  ];

  const handleNavClick = (item) => {
    setActiveNav(item.id);
    setActiveTab(item.tab || item.id);
    if (item.id === 'home') {
      window.setTimeout(() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }), 0);
    }
    if (item.id === 'products') {
      window.setTimeout(() => document.getElementById('shop-catalog-anchor')?.scrollIntoView({ behavior: 'smooth' }), 0);
    }
    if (item.id === 'offers') {
      window.setTimeout(() => document.getElementById('shop-catalog-anchor')?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
    if (item.id === 'contact') {
      window.setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  };

  return (
    <>
      <header className={`main-header${scrolled ? ' scrolled' : ''}`} dir="ltr">
        {/* Logo */}
        <div
          className="header-logo-container"
          style={{ cursor: 'pointer' }}
          onClick={() => { setActiveNav('home'); setActiveTab('catalog'); }}
        >
          <Logo height={scrolled ? 34 : 42} />
        </div>

        {/* Desktop Nav */}
        <nav className="nav-links">
          {navItems.map(item => (
            <span
              key={item.id}
              className={`nav-item${activeNav === item.id ? ' active' : ''}`}
              onClick={() => handleNavClick(item)}
            >
              {item.label}
            </span>
          ))}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {/* Vehicle Selector */}
          <button
            type="button"
            className={`garage-status-btn${activeVehicle ? ' active-selected' : ''}`}
            onClick={onGarageClick}
          >
            <Car size={15} />
            <span>
              {activeVehicle
                ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
                : t('nav.selectVehicle')}
            </span>
            <ChevronDown size={12} style={{ opacity: 0.6 }} />
          </button>

          {/* Garage */}
          <button
            className="action-btn"
            onClick={onGarageClick}
            title={t('nav.myGarage')}
          >
            <Car size={18} />
          </button>

          {/* Cart */}
          <button
            className="action-btn"
            onClick={onCartClick}
            title={t('nav.cart')}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
          </button>

          {/* Language Toggle */}
          <div className="lang-toggle">
            <button
              className={`lang-btn${lang === 'en' ? ' active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              className={`lang-btn${lang === 'ar' ? ' active' : ''}`}
              onClick={() => setLang('ar')}
            >
              ع
            </button>
          </div>

          {/* Theme */}
          <button
            className="action-btn"
            onClick={onThemeToggle}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="action-btn owner-login-btn"
            onClick={() => onOwnerAccess('owner-login')}
            title={t('owner.login')}
            aria-label={t('owner.login')}
          >
            <Lock size={17} />
          </button>

          {/* Mobile Menu */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <div
        className={`mobile-nav-overlay${mobileOpen ? ' open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) setMobileOpen(false); }}
      >
        <div className="mobile-nav-drawer">
          {/* Drawer Header */}
          <div className="mobile-nav-header">
            <Logo height={36} />
            <button
              className="drawer-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          {/* Nav Items */}
          {navItems.map(item => (
            <button
              key={item.id}
              className={`mobile-nav-item${activeNav === item.id ? ' active' : ''}`}
              onClick={() => handleNavClick(item)}
            >
              {item.label}
            </button>
          ))}

          {/* Bottom Actions */}
          <div className="mobile-nav-actions">
            <button
              className="btn-outline owner-mobile-login"
              onClick={() => { onOwnerAccess('owner-login'); setMobileOpen(false); }}
              style={{ justifyContent: 'center' }}
            >
              <Lock size={15} /> {t('owner.login')}
            </button>

            {/* Language Toggle */}
            <div className="lang-toggle" style={{ alignSelf: 'flex-start' }}>
              <button
                className={`lang-btn${lang === 'en' ? ' active' : ''}`}
                onClick={() => setLang('en')}
              >
                English
              </button>
              <button
                className={`lang-btn${lang === 'ar' ? ' active' : ''}`}
                onClick={() => setLang('ar')}
              >
                العربية
              </button>
            </div>

            {/* Garage / Cart Quick */}
            <button
              className="btn-outline"
              onClick={() => { onGarageClick(); setMobileOpen(false); }}
              style={{ justifyContent: 'center' }}
            >
              <Car size={16} />
              {t('nav.myGarage')}
            </button>

            <button
              className="btn-primary"
              onClick={() => { onCartClick(); setMobileOpen(false); }}
              style={{ justifyContent: 'center' }}
            >
              <ShoppingBag size={16} />
              {t('nav.cart')} {cartCount > 0 && `(${cartCount})`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
