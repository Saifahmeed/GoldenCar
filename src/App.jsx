import React, { useState, useEffect, useRef } from 'react';
import {
  HelpCircle, Car, Check, ArrowRight,
  SlidersHorizontal, Mail, Phone, MapPin, Clock, MessageSquare,
  ChevronDown, ChevronLeft, ChevronRight, ShoppingBag, X, Star, Plus, Minus, Moon, Sun,
  Navigation
} from 'lucide-react';

import { productsData, categoriesData, brandsData, vehiclesData, getOfferDiscount } from './data/catalog';
import { useLanguage } from './data/i18n.jsx';

import { seedDashboardData } from './data/dashboardData';

import Header from './components/Header';
import Hero from './components/Hero';
import TikTokShowcase from './components/TikTokShowcase';
import Logo from './components/Logo';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import CheckoutPage from './components/CheckoutPage';
import CartDrawer from './components/CartDrawer';

// ─── Load custom admin products from localStorage ───────────────
function loadCustomProducts() {
  try {
    const raw = localStorage.getItem('gc_custom_products');
    const products = raw ? JSON.parse(raw) : [];
    return products.map(product => {
      if (!product.offer || product.offer.oldPrice <= 0) return product;
      const oldPrice = Math.round(product.offer.oldPrice);
      const price = Math.round(product.price);
      const discount = Number((((oldPrice - price) / oldPrice) * 100).toFixed(1));
      return { ...product, offer: { ...product.offer, discount, discountIsInput: false } };
    });
  } catch { return []; }
}

function loadDeletedProducts() {
  try {
    const raw = localStorage.getItem('gc_deleted_products');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function loadStoredValue(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// ─── Format EGP ─────────────────────────────────────────────────
function fmtEGP(n, isAr) {
  return isAr ? `${n.toLocaleString()} ج.م` : `${n.toLocaleString()} EGP`;
}

function OwnerAccessModal({ isAr, target, onSuccess, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Invalid credentials');
      onSuccess('dashboard');
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="owner-gate-backdrop" role="dialog" aria-modal="true">
      <form className="owner-gate-modal" onSubmit={handleSubmit}>
        <div className="owner-gate-lock">SECURE ACCESS</div>
        <h2>{isAr ? 'دخول آمن' : 'Secure Login'}</h2>
        <p>{isAr ? 'سجّل الدخول للوصول إلى لوحة التحكم.' : 'Sign in to access the control dashboard.'}</p>
        <input
          className="form-input"
          type="text"
          value={username}
          onChange={event => { setUsername(event.target.value); setError(false); }}
          placeholder={isAr ? 'اسم المستخدم' : 'Username'}
          autoComplete="username"
          autoFocus
        />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={event => { setPassword(event.target.value); setError(false); }}
          placeholder={isAr ? 'كلمة المرور' : 'Password'}
          autoComplete="current-password"
        />
        {error && <span className="owner-gate-error">{isAr ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Incorrect username or password'}</span>}
        <div className="owner-gate-actions">
          <button type="button" className="btn-outline" onClick={onClose}>{isAr ? 'إلغاء' : 'Cancel'}</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (isAr ? 'جاري التحقق...' : 'Checking...') : (isAr ? 'تسجيل الدخول' : 'Sign In')}
          </button>
        </div>
      </form>
    </div>
  );
}

function PrivateToolsBar({ activeTab, setActiveTab, isAr }) {
  return (
    <div className="private-tools-bar">
      {/* <span>{isAr ? 'أدوات الإدارة' : 'Management Tools'}</span> */}
      <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
        {isAr ? 'لوحة التحكم' : 'Analytics Dashboard'}
      </button>
      <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => setActiveTab('admin')}>
        {isAr ? 'إدارة المنتجات' : 'Product Management'}
      </button>
    </div>
  );
}

// ─── Star Rating Component ───────────────────────────────────────
function Stars({ rating }) {
  return (
    <span style={{ color: 'var(--yellow)', fontSize: '0.8rem' }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  );
}

// ─── Product Card ────────────────────────────────────────────────
function ProductPrice({ product, isAr, className = 'product-price' }) {
  const currency = isAr ? '\u062c.\u0645' : 'EGP';

  return (
    <div className={`${className}${product.offer ? ' has-offer' : ''}`}>
      <span className="price-current">
        <span className="currency">{currency} </span>
        {product.price.toLocaleString()}
      </span>
      {product.offer && (
        <del className="price-old">
          <span className="currency">{currency} </span>
          {product.offer.oldPrice.toLocaleString()}
        </del>
      )}
    </div>
  );
}

function ProductCard({ product, activeVehicle, onClick, onAddToCart, isAr, t }) {
  const imgMap = {
    'brakes.jpg': '/img/brakes.jpg',
    'ignition_coils.jpg': '/img/ignition_coils.jpg',
    'spark_plugs.jpg': '/img/spark_plugs.jpg',
    'intercooler.jpg': '/img/intercooler.jpg',
    'downpipe.jpg': '/img/downpipe.jpg',
    'springs.jpg': '/img/springs.jpg',
    'sway_bar.jpg': '/img/sway_bar.jpg',
    'brake_pads.jpg': '/img/brake_pads.jpg',
    'exhaust.jpg': '/img/exhaust.jpg',
    'intake.jpg': '/img/intake.jpg',
  };

  const imgSrc = product.image?.startsWith('data:')
    ? product.image
    : imgMap[product.image] || imgMap['brakes.jpg'];

  let isCompatible = null;
  if (activeVehicle && product.compatibility?.length) {
    const key = `${activeVehicle.make}-${activeVehicle.model}`;
    isCompatible = product.compatibility.includes(key);
  }

  const displayName = isAr && product.nameAr ? product.nameAr : product.name;

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-img-wrap">
        <img src={imgSrc} alt={displayName} className="product-img" loading="lazy" />
        {product.isCustom && (
          <span className={`product-badge${product.isEdited ? ' product-edited-badge' : ''}`}>
            {product.isEdited ? t('admin.editedBadge') : t('admin.customBadge')}
          </span>
        )}
        {isCompatible !== null && (
          <span className={`product-compat ${isCompatible ? 'compatible' : 'not-compatible'}`}>
            {isCompatible ? t('product.compatible') : t('product.notCompatible')}
          </span>
        )}
        {product.offer && <span className="product-offer-badge">-{getOfferDiscount(product)}% OFF</span>}
      </div>
      <div className="product-body">
        <div className="product-brand">{product.brand}</div>
        {product.offer && (
          <div className="product-offer-strip">
            <span>{isAr ? 'عرض خاص' : 'SPECIAL OFFER'}</span>
            <del>{product.offer.oldPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</del>
            <strong>{product.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</strong>
            <small>{isAr ? `لمدة ${product.offer.duration} أيام` : `${product.offer.duration} days only`}</small>
          </div>
        )}
        <div className="product-name">{displayName}</div>
        <div className="product-meta">
          <div className="product-rating">
            <Stars rating={product.rating} />
            <span>({product.reviewsCount})</span>
          </div>
          {product.offer && <ProductPrice product={product} isAr={isAr} />}
          {!product.offer && <div className="product-price">
            <span className="currency">{isAr ? 'ج.م' : 'EGP'} </span>
            {product.price.toLocaleString()}
          </div>}
        </div>
        <div className="product-actions" onClick={e => e.stopPropagation()}>
          <button
            className="product-add-btn"
            onClick={() => onAddToCart(product)}
          >
            {t('product.addCart')}
          </button>
          <button className="product-details-btn" onClick={onClick}>
            {t('product.viewDetails')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Modal ───────────────────────────────────────────────
function ProductModal({ product, isOpen, onClose, activeVehicle, onAddToCart, isAr, t }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!product) return null;

  const imgMap = {
    'brakes.jpg': '/img/brakes.jpg',
    'ignition_coils.jpg': '/img/ignition_coils.jpg',
    'spark_plugs.jpg': '/img/spark_plugs.jpg',
    'intercooler.jpg': '/img/intercooler.jpg',
    'downpipe.jpg': '/img/downpipe.jpg',
    'springs.jpg': '/img/springs.jpg',
    'sway_bar.jpg': '/img/sway_bar.jpg',
    'brake_pads.jpg': '/img/brake_pads.jpg',
    'exhaust.jpg': '/img/exhaust.jpg',
    'intake.jpg': '/img/intake.jpg',
  };

  const imgSrc = product.image?.startsWith('data:')
    ? product.image
    : imgMap[product.image] || imgMap['brakes.jpg'];
  const displayName = isAr && product.nameAr ? product.nameAr : product.name;
  const displayDesc = isAr && product.descriptionAr ? product.descriptionAr : product.description;

  const waMessage = encodeURIComponent(
    `مرحباً! استفسر عن: ${product.name} (${product.sku}) — السعر: ${product.price} EGP`
  );

  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" style={{ borderRadius: '16px' }}> {/* Adjust '16px' to your liking */}
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '3px' }}>
              {product.sku}
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{displayName}</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-img-col">
            <img src={imgSrc} alt={displayName} className="modal-img" />
            {/* Rating */}
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Stars rating={product.rating} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                {product.rating} ({product.reviewsCount} {t('product.reviews')})
              </span>
            </div>
            {/* Reviews */}
            {product.reviews?.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                {product.reviews.map(r => (
                  <div key={r.id} style={{ background: 'var(--bg-3)', borderRadius: 'var(--radius)', padding: '12px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{r.user}</span>
                      <Stars rating={r.rating} />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-info-col">
            <div className="modal-brand">{product.brand}</div>
            <div className="modal-name">{displayName}</div>

            <div className="modal-price-row">
              {product.offer && <ProductPrice product={product} isAr={isAr} className="modal-price" />}
              <div className="modal-price">
                {product.price.toLocaleString()} <span className="currency">{isAr ? 'ج.م' : 'EGP'}</span>
              </div>
              <span style={{ padding: '4px 10px', background: 'rgba(46,204,113,0.1)', color: 'var(--green)', border: '1px solid rgba(46,204,113,0.25)', borderRadius: '40px', fontSize: '0.72rem', fontWeight: 700 }}>
                {t('product.inStock')}
              </span>
            </div>

            <p className="modal-desc">{displayDesc}</p>

            {/* Specs */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="modal-specs">
                <div className="modal-specs-title">{t('product.specs')}</div>
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="modal-spec-row">
                    <span className="modal-spec-key">{k}</span>
                    <span className="modal-spec-val">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Compatibility */}
            {activeVehicle && product.compatibility?.length > 0 && (
              <div style={{ padding: '12px', background: 'var(--bg-3)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px', color: product.compatibility.includes(`${activeVehicle.make}-${activeVehicle.model}`) ? 'var(--green)' : 'var(--yellow)' }}>
                  {product.compatibility.includes(`${activeVehicle.make}-${activeVehicle.model}`)
                    ? `✓ ${t('product.compatible')} — ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
                    : `⚠ ${t('product.notCompatible')} — ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-add-btn" onClick={() => { onAddToCart(product); onClose(); }}>
            <ShoppingBag size={16} />
            {t('product.addCart')}
          </button>
          <a
            href={`https://wa.me/201111926799?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-wa-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.7" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}



// ─── Garage Drawer ───────────────────────────────────────────────
function GarageDrawer({ isOpen, onClose, garageList, activeVehicle, onSetActiveVehicle, onAddVehicle, onDeleteVehicle, isAr, t }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');

  useEffect(() => { setModel(''); setEngine(''); }, [make]);
  useEffect(() => { setEngine(''); }, [model]);

  const models = make ? vehiclesData.models[make] : [];
  const engines = make && model ? vehiclesData.engines[`${make}-${model}`] || [] : [];
  const isValid = make && model && year && engine;

  const handleAdd = () => {
    if (!isValid) return;
    onAddVehicle({ make, model, year, engine });
    setMake(''); setModel(''); setYear(''); setEngine('');
  };

  const isActive = (v) => activeVehicle &&
    v.make === activeVehicle.make && v.model === activeVehicle.model &&
    v.year === activeVehicle.year && v.engine === activeVehicle.engine;

  return (
    <div className={`drawer-overlay${isOpen ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="drawer-panel">
        <div className="drawer-header">
          <div className="drawer-title">{t('garage.title')} ({garageList.length})</div>
          <button className="drawer-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="drawer-body">
          {/* Vehicles */}
          {garageList.map((v, i) => (
            <div key={i} className={`garage-vehicle-item${isActive(v) ? ' active' : ''}`}
              onClick={() => onSetActiveVehicle(v)}
            >
              <div className="garage-vehicle-header">
                <div className="garage-vehicle-name">{v.year} {v.make} {v.model}</div>
                {isActive(v) && <span className="garage-active-badge">{t('garage.active')}</span>}
              </div>
              <div className="garage-vehicle-engine">{v.engine}</div>
              <div className="garage-vehicle-actions" onClick={e => e.stopPropagation()}>
                {!isActive(v) && (
                  <button className="garage-action-btn set-active" onClick={() => onSetActiveVehicle(v)}>
                    {t('garage.setActive')}
                  </button>
                )}
                <button className="garage-action-btn delete" onClick={() => onDeleteVehicle(v)}>
                  {t('garage.delete')}
                </button>
              </div>
            </div>
          ))}

          {garageList.length === 0 && (
            <div className="drawer-empty" style={{ minHeight: '120px' }}>
              <Car size={32} />
              <h4>{t('garage.empty')}</h4>
              <p>{t('garage.empty.sub')}</p>
            </div>
          )}

          {/* Add Form */}
          <div className="garage-add-form">
            <div className="garage-add-title">{t('garage.adding')}</div>
            <select className="garage-add-select" value={make} onChange={e => setMake(e.target.value)}>
              <option value="">1. {t('ymm.make')}</option>
              {vehiclesData.makes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select className="garage-add-select" value={model} onChange={e => setModel(e.target.value)} disabled={!make}>
              <option value="">2. {t('ymm.model')}</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select className="garage-add-select" value={year} onChange={e => setYear(e.target.value)} disabled={!model}>
              <option value="">3. {t('ymm.year')}</option>
              {vehiclesData.years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select className="garage-add-select" value={engine} onChange={e => setEngine(e.target.value)} disabled={!model}>
              <option value="">4. {t('ymm.engine')}</option>
              {engines.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <button className="garage-add-btn" onClick={handleAdd} disabled={!isValid}>
              <Car size={14} style={{ display: 'inline', marginRight: '6px' }} />
              {t('garage.addBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Data ────────────────────────────────────────────────────
const faqData = {
  en: [
    {
      q: 'How do I connect wireless Apple CarPlay to the Android Screen?',
      a: 'Turn on Bluetooth and Wi-Fi on your phone, then pair with the screen\'s Bluetooth network. Open the "ZLink" or "CarLink" app on the screen\'s main interface, and CarPlay will launch automatically within a few seconds.'
    },
    {
      q: 'Do Laser LED projector lenses require cutting my factory wires?',
      a: 'No, our Laser LED projector kits come with direct plug-and-play thread adapters (H4/H7/H11) and an integrated Canbus decoder, so they connect directly to your factory bulb harness without cutting or modifying original vehicle wiring.'
    },
    {
      q: 'How should I clean and maintain the Alcantara steering wheel wrap?',
      a: 'Wipe it gently with a damp microfiber cloth and a mild soap solution once a month. Avoid using harsh chemical cleaners or brushing the fibers too aggressively to maintain the premium soft matte texture.'
    },
    {
      q: 'What is your warranty and return policy?',
      a: 'All products are 100% original and come with manufacturer warranty. If there\'s a defect or fitment issue, contact us on WhatsApp within 7 days and we\'ll arrange an exchange or refund.'
    },
    {
      q: 'Do you offer installation services?',
      a: 'Yes! Our Cairo workshop has been installing automotive accessories for 35+ years. Book your slot via WhatsApp on +201111926799 and our team will handle everything professionally.'
    }
  ],
  ar: [
    {
      q: 'كيف أوصّل Apple CarPlay لاسلكياً على الشاشة الأندرويد؟',
      a: 'شغّل البلوتوث والواي فاي على تليفونك، وقرّب من الشاشة. افتح تطبيق "ZLink" أو "CarLink" على الشاشة وهتشتغل CarPlay أوتوماتيك في ثواني.'
    },
    {
      q: 'هل عدسات ليزر LED محتاجة تقطيع في الكابلات الأصلية؟',
      a: 'لا إطلاقاً! مجموعات عدسات الليزر جاهزة بمحولات Plug & Play (H4/H7/H11) ومفك Canbus مدمج، بتتوصل في اللوحة الأصلية مباشرة من غير أي تعديل.'
    },
    {
      q: 'إزاي أنظف غلاف عجلة القيادة من الألكانتارا؟',
      a: 'امسحه بلطف بقماش مايكروفايبر مبلل مع صابون خفيف مرة في الشهر. تجنب المنظفات الكيميائية القوية أو الفرشاة العشوائية عشان المحافظة على الملمس الناعم.'
    },
    {
      q: 'إيه سياسة الضمان والاستبدال عندكم؟',
      a: 'كل المنتجات أصلية ١٠٠٪ ومعها ضمان الشركة المصنعة. لو في عيب أو مشكلة في التوافق، تواصل معنا على واتساب خلال ٧ أيام وهنعمل استبدال أو استرجاع.'
    },
    {
      q: 'هل بتوفروا خدمة تركيب؟',
      a: 'أيوه! ورشتنا في القاهرة بتركب إكسسوارات السيارات منذ أكثر من ٣٥ سنة. احجز موعدك على واتساب +201111926799 وفريقنا هيتكفل بكل حاجة باحترافية.'
    }
  ]
};

// ─── FAQ Section ─────────────────────────────────────────────────
function FAQSection({ t, isAr }) {
  const [openIdx, setOpenIdx] = useState(null);
  const items = isAr ? faqData.ar : faqData.en;

  return (
    <section className="faq-section">
      <div className="section-wrapper">
        <div className="section-header">
          <div className="section-header-left">
            <div className="eyebrow">{t('faq.eyebrow')}</div>
            <h2 className="display-md">{t('faq.title')}</h2>
          </div>
        </div>
        <div className="faq-list">
          {items.map((item, i) => (
            <div key={i} className={`faq-item${openIdx === i ? ' open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                {item.q}
                <ChevronDown className="faq-chevron" size={18} />
              </button>
              <div className="faq-answer">
                <div className="faq-answer-inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Workshop Section ─────────────────────────────────────────────
function WorkshopSection({ t, isAr }) {
  const [counter] = useState(14287);
  const [progress] = useState(65);

  return (
    <section className="workshop-section">
      <div className="section-wrapper">
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div className="workshop-live-badge">
            <span className="ws-live-dot" />
            {t('ws.live')}
          </div>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>{t('ws.eyebrow')}</div>
          <h2 className="display-md" style={{ marginBottom: '32px' }}>{t('ws.title')}</h2>

          <div className="workshop-counter">
            <div className="workshop-counter-label">{t('ws.carNumber')}</div>
            <div className="workshop-counter-num">
              <span className="hash">#</span>{counter.toLocaleString()}
            </div>
          </div>

          <div className="workshop-progress">
            <div className="workshop-progress-header">
              <span>{t('ws.progress')}</span>
              <span style={{ fontWeight: 700 }}>{progress}%</span>
            </div>
            <div className="workshop-progress-bar">
              <div className="workshop-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="workshop-progress-text">
              Installing Android Screen 10" • Hyundai Elantra • Started 1h 32m ago
            </div>
          </div>

          <div className="workshop-stats">
            {[
              { num: '3', labelKey: 'ws.inProgress', red: true },
              { num: '12', labelKey: 'ws.queue' },
              { num: '7', labelKey: 'ws.completed', red: true },
              { num: '42m', labelKey: 'ws.avgTime' },
            ].map((s, i) => (
              <div key={i} className="workshop-stat">
                <div className="workshop-stat-num">
                  <span className={s.red ? 'red' : ''}>{s.num}</span>
                </div>
                <div className="workshop-stat-label">{t(s.labelKey)}</div>
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/201111926799"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ display: 'inline-flex', textDecoration: 'none' }}
          >
            {t('ws.book')} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── About Page ──────────────────────────────────────────────────
function AboutSection({ t, isAr }) {
  return (
    <main className="about-page section-wrapper animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="about-hero">
        <div className="about-hero-copy">
          <div className="eyebrow">{t('about.eyebrow')}</div>
          <h1 className="display-md">{t('about.title')}</h1>
          <p>{t('about.desc')}</p>
          <a
            href="https://wa.me/201111926799"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary about-cta"
          >
            {t('about.cta')} <ArrowRight size={16} />
          </a>
        </div>
        <div className="about-hero-image">
          <img src="/img/hussien-sayed.jpg" alt="Golden Car workshop" />
          <div className="about-image-caption">GOLDEN CAR / CAIRO / 1990</div>
        </div>
      </div>

      <div className="about-story">
        <div>
          <div className="eyebrow">GOLDEN AUTOMOTIVE</div>
          <h2>{t('about.story')}</h2>
        </div>
        <p>{t('about.story.desc')}</p>
      </div>

      <div className="about-stats">
        <div><strong>35+</strong><span>{t('about.years')}</span></div>
        <div><strong>14K+</strong><span>{t('about.cars')}</span></div>
        <div><strong>40+</strong><span>{t('about.brands')}</span></div>
      </div>
    </main>
  );
}

// ─── Offers Page ─────────────────────────────────────────────────
function OffersSection({ t, isAr }) {
  const offers = [
    { image: 'brakes.jpg', title: 'offers.package1', desc: 'offers.package1.desc' },
    { image: 'intercooler.jpg', title: 'offers.package2', desc: 'offers.package2.desc' },
    { image: 'exhaust.jpg', title: 'offers.package3', desc: 'offers.package3.desc' },
  ];

  return (
    <main className="offers-page section-wrapper animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="offers-page-header">
        <div className="eyebrow">{t('offers.eyebrow')}</div>
        <h1 className="display-md">{t('offers.title')}</h1>
        <p>{t('offers.desc')}</p>
      </div>
      <div className="offers-grid">
        {offers.map(offer => (
          <article className="offer-card" key={offer.title}>
            <div className="offer-card-image">
              <img src={`/img/${offer.image}`} alt="" />
              <span>GOLDEN OFFER</span>
            </div>
            <div className="offer-card-body">
              <h2>{t(offer.title)}</h2>
              <p>{t(offer.desc)}</p>
              <a href="https://wa.me/201111926799" target="_blank" rel="noopener noreferrer">
                {t('offers.cta')} <ArrowRight size={15} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

// ─── Brands Section ───────────────────────────────────────────────
function BrandsSection({ t, isAr }) {
  return (
    <section className="brands-section">
      <div className="section-wrapper">
        <div className="section-header">
          <div className="section-header-left">
            <div className="eyebrow">{t('brands.eyebrow')}</div>
            <h2 className="display-md">{t('brands.title')}</h2>
          </div>
          <div className="section-header-right">{t('brands.desc')}</div>
        </div>
        <div className="brands-stack">
          {brandsData.map(group => (
            <div key={group.id} className="brand-group">
              <div className="brand-group-head">
                <span className="brand-group-icon">{group.icon}</span>
                <div className="brand-group-name">{isAr ? group.nameAr : group.nameEn}</div>
                <div className="brand-group-count">{group.brands.length} {t('brands.count')}</div>
              </div>
              <div className="brand-chips">
                {group.brands.map(b => (
                  <span key={b} className="brand-chip">{b}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="brands-footer">
          <a
            href="https://wa.me/201111926799"
            target="_blank"
            rel="noopener noreferrer"
            className="brands-cta"
          >
            {t('brands.cta')} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

const STORE_NAME = 'Golden Kar';
const STORE_LAT = 30.054012;
const STORE_LNG = 31.2419203;

const MAP_EMBED_SRC = `https://www.google.com/maps?q=${STORE_LAT},${STORE_LNG}&z=16&output=embed`;
const MAP_LINK_URL = `https://www.google.com/maps/dir/?api=1&destination=${STORE_LAT},${STORE_LNG}`;


export function ContactMap() {
  return (
    <a
      className="contact-map-card"
      href={MAP_LINK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${STORE_NAME} — open in Google Maps`}
    >
      <iframe
        className="contact-map-iframe"
        src={MAP_EMBED_SRC}
        title={`${STORE_NAME} — map location`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={-1}
        aria-hidden="true"
      />
    </a>
  );
}

export function ContactSection({ t, isAr }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '', part: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    const msg = encodeURIComponent(`الاسم: ${form.name}\nالهاتف: ${form.phone}\nالاستفسار عن: ${form.part}\nالرسالة: ${form.message}`);
    window.open(`https://wa.me/201111926799?text=${msg}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="contact-section" id="contact">
      <div className="section-wrapper">
        <div className="section-header">
          <div className="section-header-left">
            <div className="eyebrow">{t('contact.eyebrow')}</div>
            <h2 className="display-md">{t('contact.title')}</h2>
          </div>
        </div>

        {/* We use isAr to force the layout direction correctly */}
        <div className={`contact-flex-container ${isAr ? 'is-rtl' : ''}`}>

          {/* =========================================
              LEFT SIDE: The Form
              ========================================= */}
          <div className="contact-form-side">
            <div className="contact-form">
              {submitted ? (
                <div className="form-success">
                  <div className="form-success-icon"><Check size={28} /></div>
                  <h4 style={{ fontWeight: 700 }}>{isAr ? 'تم التحويل لواتساب!' : 'Redirected to WhatsApp!'}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', textAlign: 'center' }}>
                    {isAr ? 'سيتم التواصل معك قريباً.' : 'Our team will respond to you shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">{isAr ? 'الاسم' : 'Your Name'} *</label>
                    <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={isAr ? 'اسمك' : 'Ahmed Mohamed'} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                    <input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+20 111 ..." type="tel" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{isAr ? 'استفسار عن' : 'Inquiry About'}</label>
                    <select className="form-input" value={form.part} onChange={e => setForm(p => ({ ...p, part: e.target.value }))}>
                      <option value="">{isAr ? 'اختر فئة' : 'Select Category'}</option>
                      <option value="lighting">{isAr ? 'إضاءة LED وليزر' : 'LED & Laser Lighting'}</option>
                      <option value="screens">{isAr ? 'شاشات أندرويد' : 'Android Screens'}</option>
                      <option value="seats">{isAr ? 'كراسي وكفرات' : 'Seats & Covers'}</option>
                      <option value="floormats">{isAr ? 'فرش فاخرة' : 'Luxury Floor Mats'}</option>
                      <option value="exterior">{isAr ? 'إكسسوارات خارجية' : 'Exterior Styling'}</option>
                      <option value="others">{isAr ? 'أخرى' : 'Others'}</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <label className="form-label">{isAr ? 'الرسالة' : 'Message'} *</label>
                    <textarea className="form-input" style={{ flexGrow: 1 }} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder={isAr ? 'اكتب استفسارك هنا...' : 'Write your inquiry here...'} required />
                  </div>
                  <button type="submit" className="form-submit-btn" disabled={!form.name || !form.message}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.7" /></svg>
                    {isAr ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* =========================================
              RIGHT SIDE: Info on top, Map below it
              ========================================= */}
          <div className="contact-info-side">
            <div className="contact-info">
              {[
                {
                  Icon: MapPin,
                  label: 'store',
                  value: isAr ? 'جولدن كار ستورز، التوفيقية، القاهرة، مصر' : 'Golden Kar Stores, El Tawfiqiya, Cairo, Egypt',
                  href: 'https://maps.app.goo.gl/RMd2cam1sXEX1UcZA',
                  target: '_blank',
                  rel: 'noopener noreferrer'
                },
                { Icon: Phone, label: 'phone', value: t('contact.phone'), href: 'tel:+201111926799' },
                { Icon: Mail, label: 'email', value: t('contact.email'), href: 'mailto:Hussein.sayed.hassn91@gmail.com' },
                { Icon: Clock, label: 'hours', value: t('contact.hours') },
              ].map((item, i) => (
                <div key={i} className="contact-item">
                  <div className="contact-icon"><item.Icon size={20} /></div>
                  <div>
                    <div className="contact-item-label">{item.label}</div>
                    <div className="contact-item-value">
                      {item.href
                        ? <a href={item.href} dir="ltr" target={item.target} rel={item.rel}>{item.value}</a>
                        : item.value
                      }
                    </div>
                  </div>
                </div>
              ))}

              <div className="contact-socials">
                <a href="https://wa.me/201111926799" target="_blank" rel="noopener noreferrer" className="social-btn whatsapp">
                  {t('contact.whatsapp')}
                </a>
                <a href="https://www.tiktok.com/@husseinsellaboudy" target="_blank" rel="noopener noreferrer" className="social-btn tiktok">
                  TikTok
                </a>
                <a href="https://www.instagram.com/golden_car_tunning" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
                  Instagram
                </a>
              </div>
            </div>

            {/* Map placed directly beneath the info */}
            <ContactMap />
          </div>

        </div>
      </div>
    </section>
  );
}
// ─── Footer ───────────────────────────────────────────────────────
function Footer({ t, isAr, setActiveTab, setActiveCategory }) {
  return (
    <footer className="main-footer">
      <div className="footer-grid">
        {/* Brand */}
        <div>
          <Logo height={38} />
          <p className="footer-desc" style={{ marginTop: '16px' }}>{t('footer.desc')}</p>
          <div className="footer-socials">
            {[
              { href: 'https://wa.me/201111926799', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.7" /></svg>, label: 'WhatsApp' },
              { href: 'https://www.tiktok.com/@husseinsellaboudy', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.14 8.14 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" /></svg>, label: 'TikTok' },
              { href: 'https://www.instagram.com/golden_car_tunning', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>, label: 'Instagram' },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <div className="footer-col-title">{t('footer.shop')}</div>
          <div className="footer-links">
            {['lighting', 'screens', 'seats', 'floormats', 'exterior'].map(cat => (
              <button
                key={cat}
                type="button"
                className="footer-link-item"
                onClick={() => {
                  setActiveTab('catalog');
                  setActiveCategory(cat);
                  window.setTimeout(() => document.getElementById('shop-catalog-anchor')?.scrollIntoView({ behavior: 'smooth' }), 0);
                }}
              >
                {isAr ? categoriesData.find(c => c.id === cat)?.nameAr : categoriesData.find(c => c.id === cat)?.name}
              </button>
            ))}
          </div>
        </div>

        {/* Support Links */}
        <div>
          <div className="footer-col-title">{t('nav.support')}</div>
          <div className="footer-links">
            <button type="button" className="footer-link-item" onClick={() => setActiveTab('support')}>
              {t('nav.support')}
            </button>
          </div>
        </div>

        <div>
          <div className="footer-col-title">{t('footer.contact')}</div>
          <div className="footer-links" style={{ gap: '14px' }}>
            {[
              { Icon: MapPin, text: isAr ? 'جولدن كار ستورز، التوفيقية، القاهرة، مصر' : 'Golden Kar Stores, El Tawfiqiya, Cairo, Egypt', href: 'https://maps.app.goo.gl/RMd2cam1sXEX1UcZA', target: '_blank', rel: 'noopener noreferrer' },
              { Icon: Phone, text: isAr ? t('contact.phone') : '+20 111 192 6799' },
              { Icon: Mail, text: 'Hussein.sayed.hassn91@gmail.com' },
              { Icon: Clock, text: t('contact.hours') },
            ].map((item, i) => (
              <div key={i} className="footer-contact-item">
                <item.Icon size={14} className="footer-contact-icon" />
                {item.href ? (
                  <a href={item.href} target={item.target} rel={item.rel}>{item.text}</a>
                ) : item.Icon === Phone ? (
                  <a href="tel:+201111926799" dir="ltr">{item.text}</a>
                ) : item.Icon === Mail ? (
                  <a href="mailto:Hussein.sayed.hassn91@gmail.com">{item.text}</a>
                ) : (
                  <span>{item.text}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-bottom-text">{t('footer.rights')}</span>
        <div className="footer-legal-links">
          <a href="#" className="footer-legal-link">{t('footer.privacy')}</a>
          <a href="#" className="footer-legal-link">{t('footer.terms')}</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────
export default function App() {
  const { t, isAr } = useLanguage();

  const [theme, setTheme] = useState(() => loadStoredValue('gc_theme', 'light'));
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('gc_active_tab') || 'catalog');
  const [ownerGateTarget, setOwnerGateTarget] = useState(null);
  const [ownerAuthenticated, setOwnerAuthenticated] = useState(false);
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCatalog, setShowCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompatibleOnly, setFilterCompatibleOnly] = useState(false);
  const [priceLimit, setPriceLimit] = useState(20000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [garageList, setGarageList] = useState(() => loadStoredValue('gc_garage_list', [
    { make: 'Toyota', model: 'Corolla', year: '2022', engine: '1.6L Active CVT (120 HP)' }
  ]));
  const [activeVehicle, setActiveVehicle] = useState(() => loadStoredValue('gc_active_vehicle',
    { make: 'Toyota', model: 'Corolla', year: '2022', engine: '1.6L Active CVT (120 HP)' }
  ));
  const [cartList, setCartList] = useState(() => loadStoredValue('gc_cart_list', []));

  // Ticket form
  const [ticketPart, setTicketPart] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  // Load custom products from admin
  const [customProducts, setCustomProducts] = useState(loadCustomProducts);
  const [deletedProductIds, setDeletedProductIds] = useState(loadDeletedProducts);
  const resetScrollPosition = useRef(null);
  const previousPage = useRef(currentPage);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        const authenticated = Boolean(data.authenticated);
        setOwnerAuthenticated(authenticated);
        if (!authenticated && (activeTab === 'admin' || activeTab === 'dashboard')) {
          setActiveTab('catalog');
        }
      })
      .catch(() => setOwnerAuthenticated(false));
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem('gc_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('gc_theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('gc_garage_list', JSON.stringify(garageList));
  }, [garageList]);

  useEffect(() => {
    localStorage.setItem('gc_active_vehicle', JSON.stringify(activeVehicle));
  }, [activeVehicle]);

  useEffect(() => {
    localStorage.setItem('gc_cart_list', JSON.stringify(cartList));
  }, [cartList]);

  const handleOwnerAccess = (target) => {
    if (target === 'owner-login') {
      setOwnerGateTarget(target);
      return;
    }
    if (ownerAuthenticated) {
      setActiveTab(target);
      return;
    }
    setOwnerGateTarget(target);
  };

  const unlockOwnerArea = (target) => {
    setOwnerAuthenticated(true);
    setOwnerGateTarget(null);
    setActiveTab(target);
  };

  // Reload custom when switching to catalog
  useEffect(() => {
    if (activeTab === 'catalog' || activeTab === 'offers') setCustomProducts(loadCustomProducts());
  }, [activeTab]);

  const customIds = new Set(customProducts.map(product => product.id));
  const allProducts = [
    ...productsData.filter(product => !deletedProductIds.includes(product.id) && !customIds.has(product.id)),
    ...customProducts,
  ];

  const handleCustomProductsChange = (updatedProducts, updatedDeletedIds) => {
    setCustomProducts(updatedProducts);
    if (updatedDeletedIds) setDeletedProductIds(updatedDeletedIds);
  };

  const resetFilters = () => {
    if (activeTab !== 'catalog') resetScrollPosition.current = window.scrollY;
    setActiveTab('catalog');
    setSearchQuery('');
    setActiveCategory('all');
    setSelectedBrands([]);
    setFilterCompatibleOnly(false);
    setPriceLimit(20000);
  };

  const handleProductViewChange = (view) => {
    if (view !== activeTab) resetScrollPosition.current = window.scrollY;
    setActiveTab(view);
  };

  // Seed dashboard
  useEffect(() => { seedDashboardData(); }, []);

  // Theme
  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
  }, [theme]);

  // Scroll to top on tab change
  useEffect(() => {
    if (resetScrollPosition.current !== null) {
      const scrollY = resetScrollPosition.current;
      resetScrollPosition.current = null;
      requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: 'auto' }));
      return;
    }
    window.scrollTo({ top: 0 });
  }, [activeTab]);

  // Garage
  const handleAddVehicle = (v) => {
    const exists = garageList.some(g => g.make === v.make && g.model === v.model && g.year === v.year && g.engine === v.engine);
    if (!exists) setGarageList(prev => [...prev, v]);
    setActiveVehicle(v);
  };

  const handleDeleteVehicle = (v) => {
    const updated = garageList.filter(g => !(g.make === v.make && g.model === v.model && g.year === v.year && g.engine === v.engine));
    setGarageList(updated);
    if (activeVehicle?.make === v.make && activeVehicle?.model === v.model) {
      setActiveVehicle(updated[0] || null);
    }
  };

  // Cart
  const handleAddToCart = (product, qty = 1) => {
    setCartList(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (id, delta) => {
    setCartList(prev => prev.map(i => i.product.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const handleRemoveCartItem = (id) => {
    setCartList(prev => prev.filter(i => i.product.id !== id));
  };

  // Filters
  const brandsList = Array.from(new Set(allProducts.map(p => p.brand)));

  const filteredProducts = allProducts.filter(p => {
    if (activeTab === 'offers' && !p.offer) return false;
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q) && !(p.nameAr || '').includes(q)) return false;
    }
    if (p.price > priceLimit) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
    if (filterCompatibleOnly && activeVehicle) {
      if (!p.compatibility?.includes(`${activeVehicle.make}-${activeVehicle.model}`)) return false;
    }
    return true;
  });

  const productsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, priceLimit, selectedBrands, filterCompatibleOnly, activeVehicle, activeTab]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (previousPage.current === currentPage) return;
    previousPage.current = currentPage;
    document.getElementById('shop-catalog-anchor')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [currentPage]);

  const cartTotalQty = cartList.reduce((s, i) => s + i.quantity, 0);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketPart || !ticketDesc) return;
    setTicketId(`TK-${Math.floor(Math.random() * 900000) + 100000}`);
    setTicketSubmitted(true);
    setTicketDesc(''); setTicketPart('');
  };

  const cats = categoriesData.filter(c => c.id !== 'all');

  return (
    <>
      <Header
        activeVehicle={activeVehicle}
        cartCount={cartTotalQty}
        onGarageClick={() => setIsGarageOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOwnerAccess={handleOwnerAccess}
        theme={theme}
        onThemeToggle={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
      />

      {/* ═══ CATALOG PAGE ══════════════════════════════════════════ */}
      {(activeTab === 'catalog' || activeTab === 'offers') && (
        <>
          <Hero onSelectVehicle={handleAddVehicle} onGarageClick={() => setIsGarageOpen(true)} activeVehicle={activeVehicle} />

          {/* Marquee */}
          <div className="marquee-section">
            <div className="marquee-track">
              {[
                isAr ? 'إكسسوارات السيارات' : 'CAR ACCESSORIES',
                isAr ? 'إضاءة فاخرة' : 'PREMIUM LIGHTING',
                isAr ? 'شاشات أندرويد' : 'ANDROID SCREENS',
                isAr ? 'منذ ١٩٩٠' : 'SINCE 1990',
                isAr ? 'صُنع في القاهرة' : 'CRAFTED IN CAIRO',
                isAr ? 'كراسي فاخرة' : 'LUXURY SEATS',
              ].concat([
                isAr ? 'إكسسوارات السيارات' : 'CAR ACCESSORIES',
                isAr ? 'إضاءة فاخرة' : 'PREMIUM LIGHTING',
                isAr ? 'شاشات أندرويد' : 'ANDROID SCREENS',
                isAr ? 'منذ ١٩٩٠' : 'SINCE 1990',
                isAr ? 'صُنع في القاهرة' : 'CRAFTED IN CAIRO',
                isAr ? 'كراسي فاخرة' : 'LUXURY SEATS',
              ]).map((text, i) => (
                <div key={i} className="marquee-item">{text}</div>
              ))}
            </div>
          </div>

          <TikTokShowcase isAr={isAr} />

          {/* Categories + Catalog */}
          <section className="section-wrapper" id="categories">
            <div className="section-header">
              <div className="section-header-left">
                <div className="eyebrow">{t('cat.eyebrow')}</div>
                <h2 className="display-md">{t('cat.title')}</h2>
              </div>
              <div className="section-header-right">{t('cat.desc')}</div>
            </div>

            {/* Beautiful Category Cards Grid */}
            <div className="category-cards-grid">
              {[
                {
                  id: 'lighting',
                  img: 'brakes.jpg',
                  subtitle: isAr ? 'الرؤية والأناقة' : 'VISIBILITY & STYLE',
                  title: isAr ? 'إضاءة فاخرة' : 'PREMIUM LIGHTING',
                  desc: isAr ? 'إضاءة بجودة رياضة السيارات. عدسات ليزر، إضاءة محيطية...' : 'Motorsport-grade road illumination. Dual-beam Laser LED projector lenses, Symphony app-controlled interior ambient lights, and error-free Canbus headlight bulbs designed for maximum safety.'
                },
                {
                  id: 'screens',
                  img: 'intercooler.jpg',
                  subtitle: isAr ? 'تكنولوجيا وملاحة' : 'NAVIGATION & TECH',
                  title: isAr ? 'شاشات أندرويد' : 'SMART ANDROID SCREENS',
                  desc: isAr ? 'قم بترقية تابلوه سيارتك بشاشة رقمية فاخرة. شاشات IPS عالية الدقة...' : 'Upgrade your dashboard to a premium digital cockpit. High-resolution IPS capacitive touch displays, wireless CarPlay and Android Auto, and complete steering wheel and AC integration.'
                },
                {
                  id: 'seats',
                  img: 'springs.jpg',
                  subtitle: isAr ? 'راحة وفخامة' : 'COMFORT & LUXURY',
                  title: isAr ? 'كراسي وفاخرة' : 'SEATS & LEATHER COVERS',
                  desc: isAr ? 'تنجيد جلد مخصص وأغطية حماية فائقة...' : 'Bespoke custom leather upholstery and custom-fit protective seat covers. Model-specific airbag safe designs, custom Alcantara sports steering wheel wrap upgrades, and memory foam padding.'
                },
                {
                  id: 'exterior',
                  img: 'exhaust.jpg',
                  subtitle: isAr ? 'أداء وشكل خارجي' : 'AERODYNAMICS & PROFILE',
                  title: isAr ? 'تعديلات خارجية' : 'EXTERIOR STYLING MODS',
                  desc: isAr ? 'إكسسوارات بصرية جريئة. سبويلرات خلفية فاخرة...' : 'Aggressive visual styling accessories. Premium ABS gloss-black trunk spoilers, real 3K twill dry carbon fiber M-style side mirror replacement caps, and model-specific styling enhancements.'
                }
              ].map(card => (
                <div
                  key={card.id}
                  className={`category-card ${activeCategory === card.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(card.id);
                    document.getElementById('shop-catalog-anchor')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div
                    className="category-card-bg"
                    style={{ backgroundImage: `url('/img/${card.img}')` }}
                  ></div>
                  <div className="category-card-overlay">
                    <div className="category-card-subtitle">{card.subtitle}</div>
                    <div className="category-card-title">{card.title}</div>
                    <div className="category-card-desc">{card.desc}</div>
                    <div className="category-card-action">
                      {isAr ? 'استكشف الفئة' : 'EXPLORE CATEGORY'} <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '40px', marginBottom: '40px', scrollMarginTop: 'calc(var(--header-h) + 20px)' }} id="shop-catalog-anchor">
              {/* Filtered Product Catalog */}
              <div className="shop-catalog-layout">
                <button
                  className="mobile-filter-toggle"
                  onClick={() => setShowMobileFilters(prev => !prev)}
                  aria-expanded={showMobileFilters}
                >
                  <SlidersHorizontal size={16} />
                  {showMobileFilters
                    ? (isAr ? 'إخفاء الفلاتر' : 'Hide Filters')
                    : (isAr ? 'الفلاتر' : 'Filters')}
                </button>
                {/* Sidebar */}
                <aside className={`catalog-sidebar${showMobileFilters ? ' mobile-open' : ''}`}>
                  <button className="sidebar-reset-filters-btn" onClick={resetFilters}>
                    {t('catalog.resetFilters')}
                  </button>

                  <div className="filter-group">
                    <div className="filter-title">{t('catalog.categoryFilter')}</div>
                    <select
                      className="form-input"
                      value={activeCategory}
                      onChange={e => setActiveCategory(e.target.value)}
                    >
                      <option value="all">{isAr ? 'كل التصنيفات' : 'All Categories'}</option>
                      {cats.map(category => (
                        <option key={category.id} value={category.id}>
                          {isAr ? category.nameAr : category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <div className="filter-title">{t('nav.offers')}</div>
                    <label className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        className="filter-checkbox"
                        checked={activeTab === 'offers'}
                        onChange={e => handleProductViewChange(e.target.checked ? 'offers' : 'catalog')}
                      />
                      <span>{isAr ? 'العروض الخاصة فقط' : 'Special offers only'}</span>
                    </label>
                  </div>

                  <div className="filter-group">
                    <div className="filter-title">{t('catalog.searchTitle')}</div>
                    <input
                      type="text"
                      className="filter-search-input"
                      placeholder={t('catalog.searchPlaceholder')}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {activeVehicle && (
                    <div className="sidebar-vehicle-box">
                      <div className="sidebar-vehicle-header">
                        <Check size={12} strokeWidth={3} />
                        {t('catalog.vehicleActive')}
                      </div>
                      <div className="sidebar-vehicle-info">
                        {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                      </div>
                      <label className="filter-checkbox-label" style={{ marginTop: '8px' }}>
                        <input
                          type="checkbox"
                          className="filter-checkbox"
                          checked={filterCompatibleOnly}
                          onChange={e => setFilterCompatibleOnly(e.target.checked)}
                        />
                        <span style={{ fontSize: '0.8rem' }}>{t('catalog.compatibleOnly')}</span>
                      </label>
                    </div>
                  )}

                  <div className="filter-group">
                    <div className="filter-title">{t('catalog.brandsFilter')}</div>
                    <div className="filter-options-list">
                      {brandsList.map(brand => (
                        <label key={brand} className="filter-checkbox-label">
                          <input
                            type="checkbox"
                            className="filter-checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => setSelectedBrands(prev =>
                              prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                            )}
                          />
                          <span>{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="filter-group">
                    <div className="filter-title">
                      <span>{t('catalog.maxPrice')}</span>
                      <span style={{ color: 'var(--red)' }}>
                        {priceLimit.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={20000}
                      step={500}
                      value={priceLimit}
                      onChange={e => setPriceLimit(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--red)', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '4px' }}>
                      <span>1,000</span>
                      <span>20,000</span>
                    </div>
                  </div>
                </aside>

                {/* Products */}
                <main>
                  <div className="products-layout-header">
                    <div className="results-count">
                      {t('catalog.showing')} <span>{filteredProducts.length}</span> {t('catalog.of')} <span>{allProducts.length}</span> {t('catalog.parts')}
                    </div>
                    {(searchQuery || activeCategory !== 'all' || selectedBrands.length || filterCompatibleOnly || priceLimit < 20000) && (
                      <button className="reset-filters-btn" onClick={resetFilters}>
                        {t('catalog.resetFilters')}
                      </button>
                    )}
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="no-results">
                      <SlidersHorizontal size={36} />
                      <h4>{t('catalog.noResults')}</h4>
                      <p>{t('catalog.noResults.sub')}</p>
                    </div>
                  ) : (
                    <>
                      <div className="products-grid">
                        {paginatedProducts.map(product => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            activeVehicle={activeVehicle}
                            onClick={() => setSelectedProduct(product)}
                            onAddToCart={handleAddToCart}
                            isAr={isAr}
                            t={t}
                          />
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <nav className="catalog-pagination" aria-label={isAr ? 'صفحات المنتجات' : 'Product pages'}>
                          <button
                            className="pagination-arrow"
                            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                            disabled={currentPage === 1}
                            aria-label={isAr ? 'الصفحة السابقة' : 'Previous page'}
                          >
                            <ChevronLeft size={16} />
                          </button>
                          {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                            <button
                              key={page}
                              className={`pagination-number${currentPage === page ? ' active' : ''}`}
                              onClick={() => setCurrentPage(page)}
                              aria-current={currentPage === page ? 'page' : undefined}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            className="pagination-arrow"
                            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                            disabled={currentPage === totalPages}
                            aria-label={isAr ? 'الصفحة التالية' : 'Next page'}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </nav>
                      )}
                    </>
                  )}
                </main>
              </div>
            </div>
          </section>

          <BrandsSection t={t} isAr={isAr} />
          {/* <WorkshopSection t={t} isAr={isAr} /> */}
          {/* <FAQSection t={t} isAr={isAr} /> */}
          <ContactSection t={t} isAr={isAr} />
        </>
      )}

      {/* ═══ ABOUT PAGE ═══════════════════════════════════════════ */}
      {activeTab === 'about' && <AboutSection t={t} isAr={isAr} />}

      {/* ═══ SUPPORT PAGE ════════════════════════════════════════ */}
      {activeTab === 'support' && (
        <div className="section-wrapper animate-fade-in" style={{ marginTop: 'var(--header-h)' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 56px' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>{t('support.eyebrow')}</div>
            <h2 className="display-md" style={{ marginBottom: '16px' }}>{t('support.title')}</h2>
            <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: 1.7 }}>{t('support.desc')}</p>
          </div>

          <div className="support-page-grid">
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                {t('support.faq')}
              </h3>
              {(isAr ? faqData.ar : faqData.en).slice(0, 3).map((item, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--red)', marginBottom: '8px' }}>{item.q}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{item.a}</p>
                </div>
              ))}

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)', marginTop: '32px' }}>
                {t('support.direct')}
              </h3>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { Icon: MapPin, color: 'var(--red)', text: isAr ? 'جولدن كار ستورز، التوفيقية، القاهرة، مصر' : 'Golden Kar Stores, El Tawfiqiya, Cairo, Egypt', href: 'https://maps.app.goo.gl/RMd2cam1sXEX1UcZA', target: '_blank', rel: 'noopener noreferrer' },
                  { Icon: Phone, color: 'var(--yellow)', text: '+20 111 192 6799', href: 'tel:+201111926799' },
                  { Icon: MessageSquare, color: 'var(--green)', text: '+20 111 192 6799 (WhatsApp)', href: 'https://wa.me/201111926799' },
                  { Icon: Mail, color: 'var(--red)', text: 'Hussein.sayed.hassn91@gmail.com', href: 'mailto:Hussein.sayed.hassn91@gmail.com' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <item.Icon size={18} style={{ color: item.color, flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      {item.href
                        ? <a href={item.href} target={item.target} rel={item.rel} style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 600 }}>{item.text}</a>
                        : <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>{item.text}</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Form */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '8px' }}>{t('support.ticket')}</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: '24px' }}>{t('support.ticket.desc')}</p>

              {ticketSubmitted ? (
                <div className="form-success">
                  <div className="form-success-icon"><Check size={28} /></div>
                  <h4>{t('support.submitted')}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', textAlign: 'center' }}>
                    {t('support.submitted.desc')} ({ticketId})
                  </p>
                  <button className="btn-outline" onClick={() => setTicketSubmitted(false)}>
                    {t('support.another')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit}>
                  <div className="form-group">
                    <label className="form-label">{t('support.vehicle')}</label>
                    <input
                      className="form-input"
                      value={activeVehicle ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}` : (isAr ? 'لا توجد سيارة محددة' : 'No vehicle selected')}
                      disabled
                      style={{ opacity: 0.5 }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('support.part')}</label>
                    <select className="form-input" value={ticketPart} onChange={e => setTicketPart(e.target.value)} required>
                      <option value="">-- {isAr ? 'اختر المنتج' : 'Choose Product'} --</option>
                      <option value="lighting">{isAr ? 'إضاءة ليزر LED' : 'GOLDEN Laser LED Lenses'}</option>
                      <option value="screens">{isAr ? 'شاشة أندرويد' : 'GOLDEN Smart Android Screen'}</option>
                      <option value="seats">{isAr ? 'كراسي جلد مخصصة' : 'GOLDEN Custom Leather Seats'}</option>
                      <option value="floormats">{isAr ? 'فرش 7D فاخرة' : 'GOLDEN 7D Luxury Floor Mats'}</option>
                      <option value="exterior">{isAr ? 'سبويلر / غطاء مرايا' : 'GOLDEN Trunk Spoiler / Mirror Cover'}</option>
                      <option value="others">{isAr ? 'أخرى' : 'Others'}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('support.issue')}</label>
                    <textarea
                      className="form-input"
                      rows={5}
                      placeholder={isAr ? 'صف مشكلتك أو استفسارك...' : 'Describe your issue or inquiry...'}
                      value={ticketDesc}
                      onChange={e => setTicketDesc(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="form-submit-btn" disabled={!ticketPart || !ticketDesc}>
                    {t('support.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ═══ CHECKOUT PAGE ═══════════════════════════════════════ */}
      {activeTab === 'checkout' && (
        <CheckoutPage
          cartList={cartList}
          onClearCart={() => setCartList([])}
          isAr={isAr}
          setActiveTab={setActiveTab}
          activeVehicle={activeVehicle}
        />
      )}

      {ownerAuthenticated && (activeTab === 'dashboard' || activeTab === 'admin') && (
        <PrivateToolsBar activeTab={activeTab} setActiveTab={setActiveTab} isAr={isAr} />
      )}

      {/* ═══ DASHBOARD PAGE ═══════════════════════════════════════ */}
      {ownerAuthenticated && activeTab === 'dashboard' && <Dashboard />}

      {/* ═══ ADMIN PAGE ══════════════════════════════════════════ */}
      {ownerAuthenticated && activeTab === 'admin' && (
        <AdminPanel onProductsChange={handleCustomProductsChange} />
      )}

      {ownerGateTarget && (
        <OwnerAccessModal
          isAr={isAr}
          target={ownerGateTarget}
          onSuccess={unlockOwnerArea}
          onClose={() => setOwnerGateTarget(null)}
        />
      )}

      {/* ─── Footer (show on catalog, about, and support) ─── */}
      {['catalog', 'about', 'offers', 'support'].includes(activeTab) && (
        <Footer t={t} isAr={isAr} setActiveTab={setActiveTab} setActiveCategory={setActiveCategory} />
      )}

      {/* ─── Overlays ─── */}
      <GarageDrawer
        isOpen={isGarageOpen}
        onClose={() => setIsGarageOpen(false)}
        garageList={garageList}
        activeVehicle={activeVehicle}
        onSetActiveVehicle={(v) => setActiveVehicle(v)}
        onAddVehicle={handleAddVehicle}
        onDeleteVehicle={handleDeleteVehicle}
        isAr={isAr}
        t={t}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartList={cartList}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartList([])}
        activeVehicle={activeVehicle}
        isAr={isAr}
        t={t}
        onGoToCheckout={() => { setIsCartOpen(false); setActiveTab('checkout'); }}
      />
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        activeVehicle={activeVehicle}
        onAddToCart={handleAddToCart}
        isAr={isAr}
        t={t}
      />
    </>
  );
}
