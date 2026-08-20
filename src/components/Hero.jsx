import React, { useState, useEffect } from 'react';
import { Car, ChevronRight, ArrowRight } from 'lucide-react';
import { vehiclesData } from '../data/catalog';
import { useLanguage } from '../data/i18n.jsx';


const stats = [
  { key: 'views', target: 500, suffix: 'K+', labelKey: 'hero.stat.views' },
  { key: 'products', target: 200, suffix: '+', labelKey: 'hero.stat.products' },
  { key: 'installs', target: 2, suffix: 'K+', labelKey: 'hero.stat.installs' },
  { key: 'years', target: 35, suffix: '+', labelKey: 'hero.stat.years' },
];

function useCountUp(target, duration = 1600, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

function StatItem({ stat, started }) {
  const { t } = useLanguage();
  const count = useCountUp(stat.target, 1800, started);
  return (
    <div className="hero-stat">
      <div className="hero-stat-num">
        {count}<span className="stat-red">{stat.suffix}</span>
      </div>
      <div className="hero-stat-label">{t(stat.labelKey)}</div>
    </div>
  );
}

export default function Hero({ onSelectVehicle, activeVehicle }) {
  const { t, isAr } = useLanguage();

  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStatsStarted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectedModel('');
    setSelectedEngine('');
  }, [selectedMake]);

  useEffect(() => {
    setSelectedEngine('');
  }, [selectedModel]);

  const availableModels = selectedMake ? vehiclesData.models[selectedMake] : [];
  const engineKey = `${selectedMake}-${selectedModel}`;
  const availableEngines = selectedMake && selectedModel ? vehiclesData.engines[engineKey] || [] : [];
  const isFormValid = selectedMake && selectedModel && selectedYear && selectedEngine;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!isFormValid) return;
    onSelectVehicle({ make: selectedMake, model: selectedModel, year: selectedYear, engine: selectedEngine });
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedEngine('');
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-bg" />

      <div className="hero-content">
        {/* Left — Headline & CTAs */}
        <div className="hero-left animate-fade-in">
          {/* Badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            {t('hero.badge')}
          </div>

          {/* Headline */}
          {isAr ? (
            <h1 className="hero-headline" style={{ fontFamily: 'var(--font-arabic)', fontWeight: 900, fontSize: 'clamp(2.5rem, 8vw, 6rem)', lineHeight: 1.1 }}>
              <span>{t('hero.headline1')} </span>
              <span className="red">{t('hero.headline2')}</span>
              <br />
              <span className="outline">{t('hero.headline3')}</span>
            </h1>
          ) : (
            <h1 className="hero-headline">
              {t('hero.headline1')}<br />
              <span className="outline">{t('hero.headline2')}</span><br />
              <span style={{ color: '#fff' }}>{t('hero.headline3')}</span>
            </h1>
          )}

          {/* Tagline */}
          <div className="hero-tagline">
            {isAr
              ? t('hero.tagline')
              : (
                <>
                  Everything your car needs —&nbsp;
                  <span className="accent">under one roof</span>
                </>
              )}
          </div>

          {/* Description */}
          <p className="hero-desc">{t('hero.desc')}</p>

          {/* CTAs */}
          <div className="hero-actions">
            <a href="#shop-catalog-anchor" className="btn-primary">
              {t('hero.cta.shop')} <ArrowRight size={16} />
            </a>
            <a href="#categories" className="btn-outline">
              {t('hero.cta.build')} <ChevronRight size={16} />
            </a>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {stats.map(stat => (
              <StatItem key={stat.key} stat={stat} started={statsStarted} />
            ))}
          </div>
        </div>

        {/* Right — Vehicle Selector */}
        <div className="hero-right animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="ymm-box">
            <div className="ymm-title">
              <Car size={18} />
              <div>
                <div style={{ fontWeight: 800 }}>{t('hero.selectVehicle')}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 400, marginTop: '2px', textTransform: 'none', letterSpacing: 0, color: 'var(--text-3)' }}>
                  {t('hero.selectVehicle.sub')}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="ymm-grid">
              {/* Make */}
              <select
                className="ymm-select"
                value={selectedMake}
                onChange={e => setSelectedMake(e.target.value)}
              >
                <option value="">1. {t('ymm.make')}</option>
                {vehiclesData.makes.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* Model */}
              <select
                className="ymm-select"
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                disabled={!selectedMake}
              >
                <option value="">2. {t('ymm.model')}</option>
                {availableModels.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* Year */}
              <select
                className="ymm-select"
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                disabled={!selectedModel}
              >
                <option value="">3. {t('ymm.year')}</option>
                {vehiclesData.years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              {/* Engine */}
              <select
                className="ymm-select"
                value={selectedEngine}
                onChange={e => setSelectedEngine(e.target.value)}
                disabled={!selectedModel}
              >
                <option value="">4. {t('ymm.engine')}</option>
                {availableEngines.map(eng => (
                  <option key={eng} value={eng}>{eng}</option>
                ))}
              </select>
            </form>

            <button
              type="button"
              className="ymm-action-btn"
              onClick={handleSubmit}
              disabled={!isFormValid}
              style={{ marginTop: '14px' }}
            >
              <Car size={16} />
              {t('hero.addGarage')}
              <ChevronRight size={16} />
            </button>

            {/* Social Links */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/201111926799"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn whatsapp"
                style={{ fontSize: '0.72rem' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.7"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="https://www.tiktok.com/@husseinsellaboudy"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn tiktok"
                style={{ fontSize: '0.72rem' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.14 8.14 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/>
                </svg>
                TikTok
              </a>
              <a
                href="https://www.instagram.com/golden_car_tunning"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn instagram"
                style={{ fontSize: '0.72rem' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
