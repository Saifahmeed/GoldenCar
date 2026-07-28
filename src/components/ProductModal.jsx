import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Check, AlertTriangle, XCircle, Star } from 'lucide-react';
import { imageMap, getProductImageStyle } from './ProductCard';

export default function ProductModal({ product, isOpen, onClose, activeVehicle, onAddToCart }) {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'reviews', 'fitment'

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    onClose();
  };

  // Compatibility checking
  const getCompatibility = () => {
    if (!activeVehicle) {
      return { status: 'unknown', text: 'Please select a vehicle to verify compatibility.', icon: <AlertTriangle size={18} /> };
    }
    
    const vehicleKey = `${activeVehicle.make}-${activeVehicle.model}`;
    const isCompatible = product.compatibility.includes(vehicleKey);
    
    if (isCompatible) {
      return { 
        status: 'fits', 
        text: `Fitment Confirmed: Fits your ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model} ${activeVehicle.engine}`, 
        icon: <Check size={18} /> 
      };
    } else {
      return { 
        status: 'invalid', 
        text: `Fitment Warning: This item DOES NOT FIT your ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`, 
        icon: <XCircle size={18} /> 
      };
    }
  };

  const fitment = getCompatibility();

  return (
    <div className={`modal-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Scrollable Body */}
        <div className="modal-body">
          {/* Main Info Columns */}
          <div className="product-detail-grid">
            {/* Left Image column */}
            <div className="modal-img-container">
              <img 
                src={imageMap[product.image]} 
                alt={product.name} 
                className="modal-img"
                style={getProductImageStyle(product.id)}
              />
            </div>

            {/* Right details column */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="modal-product-brand">{product.brand}</span>
              <h2 className="modal-product-name">{product.name}</h2>
              
              {/* Reviews Summary */}
              <div className="product-rating" style={{ marginBottom: '20px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < Math.floor(product.rating) ? "var(--warning)" : "none"}
                    stroke="var(--warning)" 
                  />
                ))}
                <span className="rating-count" style={{ fontSize: '0.85rem' }}>
                  {product.rating} / 5.0 ({product.reviewsCount} customer reviews)
                </span>
              </div>

              {/* Dynamic Fitment Confirmed Bar */}
              <div className={`modal-compatibility-status ${fitment.status}`}>
                {fitment.icon}
                <span>{fitment.text}</span>
              </div>

              {/* Pricing & Stock status */}
              <div className="modal-price-row">
                <span className="modal-price">
                  ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="modal-stock-status">✓ In Stock (Ready to Ship)</span>
              </div>

              {/* Short description */}
              <p className="modal-description">{product.description}</p>

              {/* Action row with quantity & add button */}
              <div className="modal-actions">
                <div className="quantity-selector">
                  <button className="quantity-btn" onClick={decrementQty}>
                    <Minus size={14} />
                  </button>
                  <span className="quantity-val">{quantity}</span>
                  <button className="quantity-btn" onClick={incrementQty}>
                    <Plus size={14} />
                  </button>
                </div>

                <button className="modal-cart-submit" onClick={handleAddToCart}>
                  <ShoppingBag size={18} />
                  <span>Add {quantity} to Cart</span>
                </button>
              </div>
            </div>
          </div>

          {/* Modal Navigation Tabs (Specs, Reviews, Fitment) */}
          <div className="modal-tabs">
            <button 
              className={`modal-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
            </button>
            <button 
              className={`modal-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews.length})
            </button>
            <button 
              className={`modal-tab-btn ${activeTab === 'fitment' ? 'active' : ''}`}
              onClick={() => setActiveTab('fitment')}
            >
              Compatible Vehicles
            </button>
          </div>

          {/* Tab Contents */}
          <div className="tab-content">
            {activeTab === 'specs' && (
              <table className="specs-table animate-fade-in">
                <tbody>
                  {Object.entries(product.specs).map(([label, val]) => (
                    <tr key={label} className="specs-row">
                      <td className="specs-label">{label}</td>
                      <td className="specs-value">{val}</td>
                    </tr>
                  ))}
                  <tr className="specs-row">
                    <td className="specs-label">SKU / Part Number</td>
                    <td className="specs-value" style={{ fontFamily: 'monospace', color: 'var(--gold-primary)' }}>{product.sku}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-tab-container animate-fade-in">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="review-item">
                    <div className="review-header">
                      <div className="review-user-info">
                        <div className="review-avatar">
                          {rev.user.substring(0, 1)}
                        </div>
                        <span className="review-username">{rev.user}</span>
                      </div>
                      <div className="review-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            fill={i < rev.rating ? "var(--warning)" : "none"}
                            stroke="var(--warning)" 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="review-text">{rev.comment}</p>
                    <span className="review-date" style={{ display: 'block', marginTop: '6px' }}>Reviewed on {rev.date}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'fitment' && (
              <div className="fitment-list-grid animate-fade-in">
                {product.compatibility.map((fit, index) => {
                  const [mk, md] = fit.split('-');
                  return (
                    <div key={index} className="fitment-item-row">
                      <Check size={14} style={{ color: 'var(--success)' }} />
                      <span>{mk} {md}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
