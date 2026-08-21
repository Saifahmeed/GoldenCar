import React from 'react';
import { X, ShoppingBag, AlertTriangle, ChevronRight } from 'lucide-react';
import { imageMap, getProductImageStyle } from './ProductCard';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartList, 
  onUpdateQty, 
  onRemoveItem, 
  activeVehicle,
  onClearCart,
  isAr,
  t,
  onGoToCheckout
}) {
  const total = cartList.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div 
      className={`drawer-overlay${isOpen ? ' open' : ''}`} 
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="drawer-panel">
        <div className="drawer-header">
          <div className="drawer-title">
            {isAr ? 'سلة التسوق' : 'Shopping Cart'} {cartList.length > 0 && `(${cartList.reduce((s, i) => s + i.quantity, 0)})`}
          </div>
          <button className="drawer-close" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="drawer-body">
          {cartList.length === 0 ? (
            <div className="drawer-empty">
              <ShoppingBag size={40} />
              <h4>{isAr ? 'سلة المشتريات فارغة' : 'Your cart is empty'}</h4>
              <p>{isAr ? 'تصفح منتجاتنا لإضافة إكسسوارات فاخرة.' : 'Browse our catalog to find premium accessories.'}</p>
            </div>
          ) : (
            cartList.map(item => {
              // Check compatibility for this specific cart item
              const isCompatible = activeVehicle 
                ? item.product.compatibility.includes(`${activeVehicle.make}-${activeVehicle.model}`) 
                : true;

              return (
                <div key={item.product.id} className="cart-item">
                  <img 
                    src={item.product.image?.startsWith('data:') || item.product.image?.startsWith('/') ? item.product.image : imageMap[item.product.image]} 
                    alt={item.product.name} 
                    className="cart-item-img" 
                    style={getProductImageStyle(item.product.id)}
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-name">
                      {isAr && item.product.nameAr ? item.product.nameAr : item.product.name}
                    </div>
                    <div className="cart-item-sku">{item.product.sku}</div>
                    <div className="cart-item-price">
                      {(item.product.price * item.quantity).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                    </div>
                    
                    <div className="cart-qty-row">
                      <button className="cart-qty-btn" onClick={() => onUpdateQty(item.product.id, -1)}>−</button>
                      <span className="cart-qty-num">{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={() => onUpdateQty(item.product.id, 1)}>+</button>
                      
                      <button className="cart-remove-btn" onClick={() => onRemoveItem(item.product.id)}>
                        {isAr ? 'حذف' : 'Remove'}
                      </button>
                    </div>

                    {!isCompatible && activeVehicle && (
                      <div className="cart-fitment-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--yellow)', fontSize: '0.72rem', marginTop: '6px' }}>
                        <AlertTriangle size={12} />
                        <span>
                          {isAr 
                            ? `لا يناسب ${activeVehicle.make} ${activeVehicle.model}` 
                            : `Doesn't fit your ${activeVehicle.model}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartList.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">{isAr ? 'الإجمالي' : 'Total'}</span>
              <span className="cart-total-amount">
                {total.toLocaleString()} <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--text-2)' }}>{isAr ? 'ج.م' : 'EGP'}</span>
              </span>
            </div>
            
            <button 
              className="cart-checkout-btn" 
              onClick={onGoToCheckout}
              style={{ background: 'var(--red)' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--red-light)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--red)'}
            >
              <span>{isAr ? 'الذهاب للدفع والشحن' : 'Proceed to Checkout'}</span>
              <ChevronRight size={16} />
            </button>
            
            <button className="cart-clear-btn" onClick={onClearCart} style={{ width: '100%', marginTop: '8px' }}>
              {isAr ? 'تفريغ السلة' : 'Clear Cart'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
