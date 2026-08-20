import React from 'react';
import { Check, AlertTriangle, X, ShoppingBag, Star } from 'lucide-react';

// Import image assets
import coiloversImg from '../assets/coilovers.jpg';
import brakesImg from '../assets/brakes.jpg';
import intakeImg from '../assets/intake.jpg';
import exhaustImg from '../assets/exhaust.jpg';
import sparkPlugsImg from '../assets/spark_plugs.jpg';
import springsImg from '../assets/springs.jpg';
import swayBarImg from '../assets/sway_bar.jpg';
import brakePadsImg from '../assets/brake_pads.jpg';
import ignitionCoilsImg from '../assets/ignition_coils.jpg';
import intercoolerImg from '../assets/intercooler.jpg';
import downpipeImg from '../assets/downpipe.jpg';
import { getOfferDiscount } from '../data/catalog';

const imageMap = {
  "coilovers.jpg": coiloversImg,
  "brakes.jpg": brakesImg,
  "intake.jpg": intakeImg,
  "exhaust.jpg": exhaustImg,
  "spark_plugs.jpg": sparkPlugsImg,
  "springs.jpg": springsImg,
  "sway_bar.jpg": swayBarImg,
  "brake_pads.jpg": brakePadsImg,
  "ignition_coils.jpg": ignitionCoilsImg,
  "intercooler.jpg": intercoolerImg,
  "downpipe.jpg": downpipeImg
};

export const getProductImageStyle = (productId) => {
  // Return clean, undistorted default style
  return { transform: 'none', filter: 'none' };
};

export default function ProductCard({ product, activeVehicle, onClick, onAddToCart, isAr }) {
  // Compatibility Check Logic
  const getCompatibility = () => {
    if (!activeVehicle) {
      return { status: 'unknown', text: 'Select Vehicle' };
    }
    
    const vehicleKey = `${activeVehicle.make}-${activeVehicle.model}`;
    const isCompatible = product.compatibility.includes(vehicleKey);
    
    if (isCompatible) {
      return { status: 'fits', text: `Fits your ${activeVehicle.model}` };
    } else {
      return { status: 'invalid', text: `Does not fit` };
    }
  };

  const compat = getCompatibility();

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div className="product-card animate-slide-up" onClick={onClick}>
      {/* Product Image and badges */}
      <div className="product-img-wrapper">
        <img 
          src={product.image?.startsWith('data:') ? product.image : imageMap[product.image]} 
          alt={product.name} 
          className="product-img"
          loading="lazy"
          style={getProductImageStyle(product.id)}
        />
        
        {/* Compatibility indicator badge */}
        <div className={`product-fitment-badge ${compat.status}`}>
          {compat.status === 'fits' && <Check size={12} strokeWidth={3} />}
          {compat.status === 'unknown' && <AlertTriangle size={12} />}
          {compat.status === 'invalid' && <X size={12} strokeWidth={3} />}
          <span>{compat.text}</span>
        </div>

        {product.isEdited && (
          <span className="product-badge product-edited-badge">{isAr ? 'معدل' : 'EDITED'}</span>
        )}
        {product.offer && <span className="product-offer-badge">-{getOfferDiscount(product)}% OFF</span>}

        {/* Category Label */}
        <span className="product-category-label">
          {product.category}
        </span>
      </div>

      {product.offer && (
        <div className="product-offer-strip">
          <span>عرض خاص</span>
          <del>{product.offer.oldPrice.toLocaleString('en-US')} {isAr ? 'ج.م' : 'EGP'}</del>
          <strong>{product.price.toLocaleString('en-US')} {isAr ? 'ج.م' : 'EGP'}</strong>
          <small>{isAr ? `لمدة ${product.offer.duration} أيام` : `${product.offer.duration} days only`}</small>
        </div>
      )}

      {/* Product Details Info */}
      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        {product.offer && (
          <div className="product-offer-details">
            <span>عرض خاص</span>
            <strong>-{getOfferDiscount(product)}%</strong>
          </div>
        )}
        <h4 className="product-name" title={product.name}>{product.name}</h4>
        
        {/* Rating stars */}
        <div className="product-rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={12} 
              fill={i < Math.floor(product.rating) ? "var(--warning)" : "none"}
              stroke="var(--warning)" 
            />
          ))}
          <span className="rating-count">({product.reviewsCount})</span>
        </div>

        {/* Footer row with price & add button */}
        <div className="product-footer">
          <div className="product-price-stack">
            {product.offer ? (
              <>
                <div className="offer-price-row">
                  <del className="product-old-price">{product.offer.oldPrice.toLocaleString('en-US')} {isAr ? 'ج.م' : 'EGP'}</del>
                  <span className="product-price">{product.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {isAr ? 'ج.م' : 'EGP'}</span>
                </div>
                <span className="offer-duration">
                  {isAr ? `العرض ساري ${product.offer.duration} أيام` : `Offer valid for ${product.offer.duration} days`}
                </span>
              </>
            ) : (
              <span className="product-price">{product.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {isAr ? 'ج.م' : 'EGP'}</span>
            )}
          </div>
          <button 
            className="add-cart-btn" 
            onClick={handleQuickAdd}
            title="Quick Add to Cart"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
export { imageMap };
