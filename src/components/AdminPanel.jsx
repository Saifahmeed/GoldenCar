import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { productsData, categoriesData } from '../data/catalog';
import { useLanguage } from '../data/i18n.jsx';


const STORAGE_KEY = 'gc_custom_products';

const emptyForm = {
  name: '',
  nameAr: '',
  brand: '',
  category: 'lighting',
  price: '',
  sku: '',
  description: '',
  descriptionAr: '',
};

function loadCustom() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustom(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function AdminPanel({ onProductsChange }) {
  const { t, isAr } = useLanguage();
  const [customProducts, setCustomProducts] = useState(loadCustom);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');

  const allProducts = [...productsData, ...customProducts];

  // Show toast
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Validate form
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.brand.trim()) e.brand = true;
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = true;
    if (!form.sku.trim()) e.sku = true;
    // Check SKU uniqueness (skip for edit)
    const skuExists = allProducts.some(p => p.sku === form.sku.trim() && p.id !== editId);
    if (skuExists) e.sku = true;
    return e;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const product = {
      ...form,
      id: editId || `custom-${Date.now()}`,
      price: Number(form.price),
      rating: 4.5,
      reviewsCount: 0,
      reviews: [],
      specs: {},
      compatibility: [],
      image: 'brakes.jpg', // default
      isCustom: true,
    };

    let updated;
    if (editId) {
      updated = customProducts.map(p => p.id === editId ? product : p);
      showToast(t('admin.saved'));
    } else {
      updated = [...customProducts, product];
      showToast(t('admin.saved'));
    }

    setCustomProducts(updated);
    saveCustom(updated);
    onProductsChange?.(updated);
    setForm(emptyForm);
    setEditId(null);
    setErrors({});
  };

  const handleEdit = (product) => {
    if (!product.isCustom) return; // Can't edit static products
    setForm({
      name: product.name,
      nameAr: product.nameAr || '',
      brand: product.brand,
      category: product.category,
      price: product.price.toString(),
      sku: product.sku,
      description: product.description || '',
      descriptionAr: product.descriptionAr || '',
    });
    setEditId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    const product = customProducts.find(p => p.id === id);
    if (!product) return;
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    const updated = customProducts.filter(p => p.id !== id);
    setCustomProducts(updated);
    saveCustom(updated);
    onProductsChange?.(updated);
    if (editId === id) { setForm(emptyForm); setEditId(null); }
    showToast(t('admin.deleted'));
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
    setErrors({});
  };

  const cats = categoriesData.filter(c => c.id !== 'all');

  return (
    <div className="admin-page" style={{ marginTop: 'var(--header-h)' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="eyebrow">{t('admin.eyebrow')}</div>
        <h2 className="display-md">{t('admin.title')}</h2>
      </div>

      <div className="admin-grid">
        {/* ─── Form Panel ─── */}
        <div className="admin-form-panel">
          <div className="admin-form-title">
            <span>{editId ? t('admin.editProduct') : t('admin.addProduct')}</span>
            {editId && (
              <button onClick={handleCancel} style={{ color: 'var(--text-3)', cursor: 'pointer', background: 'none', border: 'none' }}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="admin-form-grid">
            {/* Product Name */}
            <div className="form-group">
              <label className="form-label">{t('admin.name')} (EN) *</label>
              <input
                className={`form-input${errors.name ? ' error' : ''}`}
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g. GOLDEN LED Kit Pro"
                style={errors.name ? { borderColor: 'var(--red)' } : {}}
              />
            </div>

            {/* Arabic Name */}
            <div className="form-group">
              <label className="form-label">{t('admin.name')} (AR)</label>
              <input
                className="form-input"
                value={form.nameAr}
                onChange={e => handleChange('nameAr', e.target.value)}
                placeholder="مثال: مجموعة LED"
                dir="rtl"
              />
            </div>

            {/* Brand & Category */}
            <div className="admin-form-row">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('admin.brand')} *</label>
                <input
                  className={`form-input${errors.brand ? ' error' : ''}`}
                  value={form.brand}
                  onChange={e => handleChange('brand', e.target.value)}
                  placeholder="GOLDEN Tuning"
                  style={errors.brand ? { borderColor: 'var(--red)' } : {}}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('admin.category')} *</label>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                >
                  {cats.map(c => (
                    <option key={c.id} value={c.id}>
                      {isAr ? c.nameAr : c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & SKU */}
            <div className="admin-form-row">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('admin.price')} *</label>
                <input
                  className={`form-input${errors.price ? ' error' : ''}`}
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={e => handleChange('price', e.target.value)}
                  placeholder="5000"
                  style={errors.price ? { borderColor: 'var(--red)' } : {}}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('admin.sku')} *</label>
                <input
                  className={`form-input${errors.sku ? ' error' : ''}`}
                  value={form.sku}
                  onChange={e => handleChange('sku', e.target.value.toUpperCase())}
                  placeholder="GD-LGT-XXX"
                  style={errors.sku ? { borderColor: 'var(--red)' } : {}}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">{t('admin.description')} (EN)</label>
              <textarea
                className="form-input"
                rows={3}
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Product description..."
              />
            </div>

            {/* Arabic Description */}
            <div className="form-group">
              <label className="form-label">{t('admin.description')} (AR)</label>
              <textarea
                className="form-input"
                rows={3}
                value={form.descriptionAr}
                onChange={e => handleChange('descriptionAr', e.target.value)}
                placeholder="وصف المنتج..."
                dir="rtl"
              />
            </div>

            {/* Validation Error Message */}
            {Object.keys(errors).length > 0 && (
              <div style={{ padding: '10px 14px', background: 'rgba(227,30,36,0.08)', border: '1px solid rgba(227,30,36,0.25)', borderRadius: 'var(--radius)', fontSize: '0.78rem', color: 'var(--red)' }}>
                {isAr ? 'يرجى ملء الحقول المطلوبة بشكل صحيح' : 'Please fill in all required fields correctly.'}
              </div>
            )}

            {/* Save Button */}
            <button className="admin-save-btn" onClick={handleSave}>
              <Check size={16} style={{ display: 'inline', marginRight: '6px' }} />
              {t('admin.save')}
            </button>

            {editId && (
              <button className="admin-cancel-btn" onClick={handleCancel}>
                {t('admin.cancel')}
              </button>
            )}
          </div>
        </div>

        {/* ─── Product List ─── */}
        <div className="admin-product-list-panel">
          <div className="admin-list-header">
            {t('admin.productList')} ({allProducts.length})
          </div>

          {allProducts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>
              {t('admin.noProducts')}
            </div>
          ) : (
            allProducts.map(product => (
              <div key={product.id} className="admin-product-row">
                <div>
                  <div className="admin-product-name">
                    {isAr && product.nameAr ? product.nameAr : product.name}
                  </div>
                  <div className="admin-product-cat">
                    {isAr
                      ? categoriesData.find(c => c.id === product.category)?.nameAr
                      : categoriesData.find(c => c.id === product.category)?.name
                    } · {product.sku}
                  </div>
                </div>

                <div className="admin-product-price">
                  {product.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                </div>

                <span className={`admin-badge ${product.isCustom ? 'custom' : 'static'}`}>
                  {product.isCustom ? t('admin.customBadge') : t('admin.staticBadge')}
                </span>

                <div className="admin-product-actions">
                  <button
                    className="admin-action"
                    onClick={() => handleEdit(product)}
                    disabled={!product.isCustom}
                    title={product.isCustom ? t('admin.edit') : isAr ? 'لا يمكن تعديل المنتجات الأساسية' : 'Cannot edit static products'}
                    style={!product.isCustom ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="admin-action delete"
                    onClick={() => handleDelete(product.id)}
                    disabled={!product.isCustom}
                    title={product.isCustom ? t('admin.delete') : isAr ? 'لا يمكن حذف المنتجات الأساسية' : 'Cannot delete static products'}
                    style={!product.isCustom ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="admin-success-toast">
          <Check size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}

// Export for use in App
export { loadCustom };
