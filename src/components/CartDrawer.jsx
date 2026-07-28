import React, { useState } from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2, AlertTriangle, CreditCard, ChevronRight, Check } from 'lucide-react';
import { imageMap, getProductImageStyle } from './ProductCard';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartList, 
  onUpdateQty, 
  onRemoveItem, 
  activeVehicle,
  onClearCart
}) {
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'info', 'payment', 'processing', 'success'
  
  // Checkout Form States
  const [fullName, setFullName] = useState('Hussein Sayed Hassn');
  const [address, setAddress] = useState('Golden Car Stores Tawfiqia Cairo');
  const [email, setEmail] = useState('Hussein.sayed.hassn91@gmail.com');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Reset checkout wizard on close
  const handleClose = () => {
    onClose();
    // Delay resetting step to avoid flash during transitions
    setTimeout(() => {
      setCheckoutStep('cart');
      setFullName('Hussein Sayed Hassn');
      setAddress('Golden Car Stores Tawfiqia Cairo');
      setEmail('Hussein.sayed.hassn91@gmail.com');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
    }, 300);
  };

  const calculateSubtotal = () => {
    return cartList.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 15.00 : 0.00;
  const tax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + shipping + tax;

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (fullName && address && email) {
      setCheckoutStep('payment');
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (cardNumber && cardExpiry && cardCvv) {
      setCheckoutStep('processing');
      // Simulate API verification call
      setTimeout(() => {
        setCheckoutStep('success');
        onClearCart();
      }, 2500);
    }
  };

  return (
    <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <h3 className="drawer-title">
            <ShoppingBag size={20} className="glow-text-gold" />
            <span>
              {checkoutStep === 'cart' && 'Shopping Cart'}
              {checkoutStep === 'info' && 'Delivery Details'}
              {checkoutStep === 'payment' && 'Payment Simulator'}
              {checkoutStep === 'processing' && 'Processing Order'}
              {checkoutStep === 'success' && 'Order Placed!'}
            </span>
          </h3>
          <button className="drawer-close" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="drawer-content">
          {/* STEP 1: CART ITEMS VIEW */}
          {checkoutStep === 'cart' && (
            <>
              {cartList.length === 0 ? (
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
                  <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                  <p className="garage-empty-text" style={{ padding: 0 }}>Your cart is empty.</p>
                </div>
              ) : (
                <div className="cart-items-container">
                  {cartList.map((item, index) => {
                    // Check compatibility for this specific cart item
                    const isCompatible = activeVehicle 
                      ? item.product.compatibility.includes(`${activeVehicle.make}-${activeVehicle.model}`) 
                      : true;

                    return (
                      <div key={item.product.id} className="cart-item-row">
                        <img 
                          src={imageMap[item.product.image]} 
                          alt={item.product.name} 
                          className="cart-item-img"
                          style={getProductImageStyle(item.product.id)}
                        />
                        <div className="cart-item-details">
                          <h5 className="cart-item-name">{item.product.name}</h5>
                          
                          {/* Qty & Price Row */}
                          <div className="cart-item-price-qty">
                            <span className="cart-item-price">${(item.product.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            
                            <div className="cart-item-qty-selector">
                              <button className="cart-item-qty-btn" onClick={() => onUpdateQty(item.product.id, -1)}>
                                <Minus size={10} />
                              </button>
                              <span className="cart-item-qty-val">{item.quantity}</span>
                              <button className="cart-item-qty-btn" onClick={() => onUpdateQty(item.product.id, 1)}>
                                <Plus size={10} />
                              </button>
                            </div>
                          </div>

                          {/* Fitment warning inside cart */}
                          {!isCompatible && activeVehicle && (
                            <div className="cart-fitment-warning">
                              <AlertTriangle size={14} />
                              <span>Doesn't fit {activeVehicle.year} {activeVehicle.model}</span>
                            </div>
                          )}
                        </div>

                        {/* Delete button */}
                        <button className="cart-item-delete" onClick={() => onRemoveItem(item.product.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Cart Totals & Checkout Button */}
              {cartList.length > 0 && (
                <div className="cart-checkout-summary animate-fade-in">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="summary-row">
                    <span>Estimated Shipping</span>
                    <span>${shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="summary-row">
                    <span>Estimated Sales Tax</span>
                    <span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Cost</span>
                    <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <button className="checkout-btn" onClick={() => setCheckoutStep('info')}>
                    <span>Proceed to Checkout</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CUSTOMER INFO VIEW */}
          {checkoutStep === 'info' && (
            <form onSubmit={handleInfoSubmit} className="checkout-wizard-container">
              <div className="checkout-form-group">
                <label className="checkout-form-label">Full Name</label>
                <input 
                  type="text" 
                  className="checkout-form-input" 
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="checkout-form-group">
                <label className="checkout-form-label">Email Address</label>
                <input 
                  type="email" 
                  className="checkout-form-input" 
                  placeholder="e.g. john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="checkout-form-group">
                <label className="checkout-form-label">Delivery Address</label>
                <input 
                  type="text" 
                  className="checkout-form-input" 
                  placeholder="Street address, City, ZIP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  className="checkout-btn" 
                  style={{ background: 'rgba(255,255,255,0.03)', boxShadow: 'none' }}
                  onClick={() => setCheckoutStep('cart')}
                >
                  Back
                </button>
                <button type="submit" className="checkout-btn" style={{ flexGrow: 1 }} disabled={!fullName || !address || !email}>
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT SIMULATOR VIEW */}
          {checkoutStep === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="checkout-wizard-container">
              <div style={{ background: 'rgba(230,185,48,0.05)', border: '1px solid rgba(230,185,48,0.2)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CreditCard size={18} style={{ color: 'var(--gold-primary)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-grey)' }}>Simulator Mode: Enter any credit card digits to authorize order. No actual funds are charged.</span>
              </div>

              <div className="checkout-form-group">
                <label className="checkout-form-label">Card Number</label>
                <input 
                  type="text" 
                  className="checkout-form-input" 
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>

              <div className="checkout-grid-2">
                <div className="checkout-form-group">
                  <label className="checkout-form-label">Expiration Date</label>
                  <input 
                    type="text" 
                    className="checkout-form-input" 
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                  />
                </div>
                <div className="checkout-form-group">
                  <label className="checkout-form-label">CVV Code</label>
                  <input 
                    type="password" 
                    className="checkout-form-input" 
                    placeholder="•••"
                    value={cardCvv}
                    maxLength="4"
                    onChange={(e) => setCardCvv(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  className="checkout-btn" 
                  style={{ background: 'rgba(255,255,255,0.03)', boxShadow: 'none' }}
                  onClick={() => setCheckoutStep('info')}
                >
                  Back
                </button>
                <button type="submit" className="checkout-btn" style={{ flexGrow: 1 }} disabled={!cardNumber || !cardExpiry || !cardCvv}>
                  Pay ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: PROCESSING TRANSACTION */}
          {checkoutStep === 'processing' && (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
              <div className="success-icon-wrapper" style={{ animation: 'spin 1.5s linear infinite', borderColor: 'var(--gold-primary)', color: 'var(--gold-primary)' }}>
                <CreditCard size={32} />
              </div>
              <h4 className="success-title" style={{ color: 'var(--gold-primary)' }}>Authorizing Payment...</h4>
              <p className="success-desc">Validating fitment configuration and processing simulated secure gateway connection...</p>
              
              {/* CSS spinner helper inside react */}
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* STEP 5: SUCCESS SCREEN */}
          {checkoutStep === 'success' && (
            <div className="success-checkout-screen animate-fade-in">
              <div className="success-icon-wrapper">
                <Check size={36} strokeWidth={3} />
              </div>
              <h4 className="success-title">Order Confirmed!</h4>
              <p className="success-desc">
                Thank you for choosing **GOLDEN**. Your simulated payment was approved! Order **#GD-{(Math.floor(Math.random() * 90000) + 10000)}** is packing and ready for dispatch.
              </p>
              <button className="checkout-btn" onClick={handleClose}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
