import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  MapPin, 
  Phone, 
  User, 
  ShoppingBag, 
  Check, 
  AlertTriangle, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Wallet,
  Smartphone
} from 'lucide-react';
import { imageMap, getProductImageStyle } from './ProductCard';

// Local translations for checkout page to keep code self-contained and clean
const checkoutTranslations = {
  en: {
    title: 'Secure Checkout',
    back: 'Back to Shop',
    step1: 'Customer Info',
    step2: 'Payment Method',
    step3: 'Summary',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    phone: 'Phone Number',
    phonePlaceholder: 'Enter your phone number (e.g., 01xxxxxxxxx)',
    address: 'Delivery Address',
    addressPlaceholder: 'Street address, City, Apartment',
    payType: 'How would you like to pay?',
    cod: 'Cash on Delivery (COD)',
    codDesc: 'Pay in cash upon delivery to your doorstep',
    payNow: 'Pay Now (Electronic Transfer)',
    payNowDesc: 'Instantly pay via Vodafone Cash or InstaPay',
    payAmtOption: 'Payment Amount Option',
    payFull: 'Pay Full Amount',
    payFullDesc: 'Pay 100% of the total amount now',
    payDeposit: 'Pay Deposit (Minimum 25%)',
    payDepositDesc: 'Pay a deposit now and the rest on delivery',
    depositLabel: 'Deposit Percentage',
    minDepositWarning: 'Deposit must be at least 25% of the total value',
    offerRestriction: 'Offer items in cart must be paid in full (Deposit disabled)',
    payMethod: 'Select Payment Channel',
    instapay: 'InstaPay Transfer',
    instapayDesc: 'Transfer via InstaPay network instantly',
    vfCash: 'Vodafone Cash',
    vfCashDesc: 'Transfer to our Vodafone Cash wallet',
    transferInstructions: 'Transfer Instructions',
    instapayInstructions: 'Please transfer the required amount to our InstaPay address:',
    vfInstructions: 'Please transfer the required amount to our Vodafone Cash number:',
    transferCopy: 'Copy Details',
    copied: 'Copied!',
    referenceNumber: 'Transfer Reference Number / Phone Number Sent From',
    referencePlaceholder: 'Enter reference number or your wallet number',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Sales Tax (8%)',
    total: 'Total Cost',
    dueNow: 'Amount Due Now',
    dueOnDelivery: 'Remaining on Delivery',
    confirmOrder: 'Confirm and Place Order',
    confirmCOD: 'Confirm Cash on Delivery Order',
    processing: 'Processing your order...',
    successTitle: 'Order Placed Successfully!',
    successDesc: 'Thank you for shopping with GOLDEN. Your order has been placed and is currently being processed.',
    orderNo: 'Order Number',
    whatsappTrack: 'Track via WhatsApp',
    emptyCart: 'Your cart is empty',
    emptyCartDesc: 'Please add items to your cart before checking out.',
    item: 'item',
    items: 'items',
    egp: 'EGP'
  },
  ar: {
    title: 'إتمام عملية الشراء',
    back: 'العودة للمتجر',
    step1: 'بيانات العميل',
    step2: 'طريقة الدفع',
    step3: 'الملخص',
    fullName: 'الاسم بالكامل',
    fullNamePlaceholder: 'أدخل اسمك ثلاثي أو رباعي',
    phone: 'رقم الهاتف',
    phonePlaceholder: 'أدخل رقم هاتفك (مثال: 01xxxxxxxxx)',
    address: 'عنوان التوصيل',
    addressPlaceholder: 'الشارع، المنطقة، رقم الشقة/الدور',
    payType: 'كيف تفضل الدفع؟',
    cod: 'الدفع عند الاستلام',
    codDesc: 'ادفع نقداً عند استلام طلبك أمام باب البيت',
    payNow: 'ادفع الآن (تحويل إلكتروني)',
    payNowDesc: 'ادفع فوراً عبر فودافون كاش أو انستا باي لتسريع الشحن',
    payAmtOption: 'خيار قيمة الدفع',
    payFull: 'دفع المبلغ كاملاً',
    payFullDesc: 'دفع 100% من إجمالي الفاتورة الآن',
    payDeposit: 'دفع عربون (بحد أدنى 25%)',
    payDepositDesc: 'ادفع عربون لتأكيد الطلب والباقي عند الاستلام',
    depositLabel: 'نسبة العربون',
    minDepositWarning: 'يجب أن يكون العربون 25% على الأقل من قيمة السلة',
    offerRestriction: 'المنتجات التي عليها عروض تتطلب دفع المبلغ كاملاً (تم إيقاف خيار العربون)',
    payMethod: 'اختر طريقة الدفع الإلكتروني',
    instapay: 'تحويل عبر انستا باي (InstaPay)',
    instapayDesc: 'حول مباشرة إلى عنوان انستا باي الخاص بنا',
    vfCash: 'فودافون كاش (Vodafone Cash)',
    vfCashDesc: 'حول إلى محفظة فودافون كاش الخاصة بنا',
    transferInstructions: 'تعليمات تحويل الأموال',
    instapayInstructions: 'برجاء تحويل المبلغ المطلوب إلى عنوان انستا باي التالي:',
    vfInstructions: 'برجاء تحويل المبلغ المطلوب إلى رقم فودافون كاش التالي:',
    transferCopy: 'نسخ البيانات',
    copied: 'تم النسخ!',
    referenceNumber: 'رقم عملية التحويل / رقم المحفظة المحول منها',
    referencePlaceholder: 'أدخل رقم المعاملة أو رقم الهاتف المحول منه',
    orderSummary: 'ملخص الطلب',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    tax: 'ضريبة المبيعات (8%)',
    total: 'الإجمالي الكلي',
    dueNow: 'المبلغ المستحق الدفع الآن',
    dueOnDelivery: 'المتبقي عند الاستلام',
    confirmOrder: 'تأكيد وإرسال الطلب',
    confirmCOD: 'تأكيد طلب الدفع عند الاستلام',
    processing: 'جاري تسجيل طلبك...',
    successTitle: 'تم تسجيل طلبك بنجاح!',
    successDesc: 'شكراً لتسوقك من جولدن كار. تم تسجيل طلبك بنجاح وجاري تجهيزه للتوصيل.',
    orderNo: 'رقم الطلب',
    whatsappTrack: 'متابعة الطلب عبر الواتساب',
    emptyCart: 'سلة المشتريات فارغة',
    emptyCartDesc: 'يرجى إضافة منتجات إلى السلة قبل التوجه لصفحة الشراء.',
    item: 'منتج',
    items: 'منتجات',
    egp: 'ج.م'
  }
};

export default function CheckoutPage({ 
  cartList, 
  onClearCart, 
  isAr, 
  setActiveTab, 
  activeVehicle 
}) {
  const t = (key) => {
    const lang = isAr ? 'ar' : 'en';
    return checkoutTranslations[lang][key] || key;
  };

  // Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentType, setPaymentType] = useState('cod'); // 'cod', 'now'
  const [payOption, setPayOption] = useState('full'); // 'full', 'deposit'
  const [paymentMethod, setPaymentMethod] = useState('instapay'); // 'instapay', 'vf_cash'
  const [depositPercent, setDepositPercent] = useState(25); // 25 to 100
  const [refNumber, setRefNumber] = useState('');
  
  // Checkout process states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // Check if cart contains items with offers
  const hasOfferItems = cartList.some(item => item.product.offer);

  // Auto-switch payOption to full if cart contains offer items
  useEffect(() => {
    if (hasOfferItems) {
      setPayOption('full');
    }
  }, [hasOfferItems]);

  // Pricing calculations (EGP)
  const calculateSubtotal = () => {
    return cartList.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 150 : 0; // EGP 150 shipping
  const tax = Math.round(subtotal * 0.08); // 8% sales tax
  const total = subtotal + shipping + tax;

  // Calculate Amount Due Now vs Due on Delivery
  let dueNow = 0;
  let dueOnDelivery = total;

  if (paymentType === 'now') {
    if (payOption === 'full') {
      dueNow = total;
      dueOnDelivery = 0;
    } else {
      // Deposit calculation (at least 25%)
      const pct = Math.max(25, depositPercent);
      dueNow = Math.round(total * (pct / 100));
      dueOnDelivery = total - dueNow;
    }
  }

  // Copy helper
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address) return;
    if (paymentType === 'now' && !refNumber) return;

    const generatedOrderId = `GD-${Math.floor(Math.random() * 90000) + 10000}`;
    setOrderId(generatedOrderId);

    if (paymentType === 'cod') {
      // Clear cart
      onClearCart();
      // Show success state
      setIsSuccess(true);
      
      // Generate WhatsApp message and redirect immediately (to prevent popup blocker)
      const vehicleInfo = activeVehicle ? `سيارة: ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}` : '';
      const cartSummary = cartList.map(item => `- ${item.product.name} (x${item.quantity})`).join('\n');
      const paymentDetails = isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery';
      
      const message = encodeURIComponent(
        isAr 
          ? `مرحباً جولدن كار، أود إرسال طلب جديد الدفع عند الاستلام!\n\nرقم الطلب: ${generatedOrderId}\nالاسم: ${fullName}\nرقم الهاتف: ${phone}\nالعنوان: ${address}\n${vehicleInfo}\n\nالمنتجات:\n${cartSummary}\n\nطريقة الدفع: ${paymentDetails}\nالإجمالي: ${total.toLocaleString()} ج.م`
          : `Hello Golden Car, I would like to place a new Cash on Delivery order!\n\nOrder Number: ${generatedOrderId}\nName: ${fullName}\nPhone: ${phone}\nAddress: ${address}\n${vehicleInfo}\n\nProducts:\n${cartSummary}\n\nPayment: ${paymentDetails}\nTotal: ${total.toLocaleString()} EGP`
      );

      window.open(`https://wa.me/201111926799?text=${message}`, '_blank');
    } else {
      setIsSubmitting(true);
      // For Pay Now, simulate processing
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        onClearCart();
      }, 2500);
    }
  };

  const handleWhatsappRedirect = () => {
    // Generate text message for WhatsApp tracking
    const vehicleInfo = activeVehicle ? `سيارة: ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}` : '';
    const cartSummary = cartList.map(item => `- ${item.product.name} (x${item.quantity})`).join('\n');
    
    let paymentDetails = '';
    if (paymentType === 'cod') {
      paymentDetails = isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery';
    } else {
      const methodText = paymentMethod === 'instapay' ? 'InstaPay' : 'Vodafone Cash';
      const optionText = payOption === 'full' ? (isAr ? 'مبلغ كامل' : 'Full Amount') : (isAr ? `عربون بنسبة ${depositPercent}%` : `Deposit ${depositPercent}%`);
      paymentDetails = `${methodText} (${optionText}) - المدفوع: ${dueNow.toLocaleString()} ${t('egp')} - المتبقي: ${dueOnDelivery.toLocaleString()} ${t('egp')}\nالعملية/الرقم: ${refNumber}`;
    }

    const message = encodeURIComponent(
      isAr 
        ? `مرحباً جولدن كار، أود متابعة طلبي!\n\nرقم الطلب: ${orderId}\nالاسم: ${fullName}\nرقم الهاتف: ${phone}\nالعنوان: ${address}\n${vehicleInfo}\n\nالمنتجات:\n${cartSummary}\n\nطريقة الدفع: ${paymentDetails}\nالإجمالي: ${total.toLocaleString()} ج.م`
        : `Hello Golden Car, I would like to track my order!\n\nOrder Number: ${orderId}\nName: ${fullName}\nPhone: ${phone}\nAddress: ${address}\n${vehicleInfo}\n\nProducts:\n${cartSummary}\n\nPayment: ${paymentDetails}\nTotal: ${total.toLocaleString()} EGP`
    );

    window.open(`https://wa.me/201111926799?text=${message}`, '_blank');
  };

  if (isSuccess) {
    return (
      <div className="section-wrapper animate-fade-in" style={{ marginTop: 'var(--header-h)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - var(--header-h) - 200px)' }}>
        <div className="checkout-success-card">
          <div className="success-icon-container">
            <Check size={48} strokeWidth={3} className="success-icon" />
          </div>
          <h2 className="display-sm" style={{ marginBottom: '16px' }}>{t('successTitle')}</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            {t('successDesc')}
          </p>

          <div className="order-details-box">
            <div className="order-details-row">
              <span>{t('orderNo')}</span>
              <strong className="order-number-badge">{orderId}</strong>
            </div>
            <div className="order-details-row">
              <span>{t('fullName')}</span>
              <span>{fullName}</span>
            </div>
            <div className="order-details-row">
              <span>{t('total')}</span>
              <span>{total.toLocaleString()} {t('egp')}</span>
            </div>
            {paymentType === 'now' && (
              <>
                <div className="order-details-row">
                  <span>{t('dueNow')}</span>
                  <span style={{ color: 'var(--green)', fontWeight: 'bold' }}>{dueNow.toLocaleString()} {t('egp')}</span>
                </div>
                {dueOnDelivery > 0 && (
                  <div className="order-details-row">
                    <span>{t('dueOnDelivery')}</span>
                    <span>{dueOnDelivery.toLocaleString()} {t('egp')}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' }}>
            <button 
              onClick={handleWhatsappRedirect}
              className="btn-primary whatsapp-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#25D366', borderColor: '#25D366', color: '#fff' }}
            >
              <Smartphone size={18} />
              <span>{t('whatsappTrack')}</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('catalog')} 
              className="btn-outline"
            >
              {t('back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-wrapper checkout-page-container animate-fade-in" style={{ marginTop: 'var(--header-h)' }} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Page Title & Back link */}
      <div className="checkout-page-header">
        <button className="back-to-shop-btn" onClick={() => setActiveTab('catalog')}>
          {isAr ? <ChevronRight size={18} /> : <ArrowLeft size={18} />}
          <span>{t('back')}</span>
        </button>
        <h1 className="display-sm font-display-el" style={{ color: 'var(--text)' }}>
          {t('title')}
        </h1>
      </div>

      {cartList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <ShoppingBag size={48} style={{ color: 'var(--text-3)', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>{t('emptyCart')}</h3>
          <p style={{ color: 'var(--text-2)', marginBottom: '24px' }}>{t('emptyCartDesc')}</p>
          <button className="btn-primary" onClick={() => setActiveTab('catalog')}>{t('back')}</button>
        </div>
      ) : (
        <div className="checkout-grid">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="checkout-main-form">
            
            {/* Step 1: Customer Details */}
            <div className="checkout-section-card">
              <h3 className="checkout-sec-title">
                <span className="step-badge">1</span>
                <span>{t('step1')}</span>
              </h3>
              
              <div className="checkout-fields-grid">
                <div className="form-group-checkout">
                  <label className="form-label-checkout">
                    <User size={16} />
                    <span>{t('fullName')} <span style={{ color: 'var(--red)' }}>*</span></span>
                  </label>
                  <input 
                    type="text" 
                    className="checkout-form-input" 
                    placeholder={t('fullNamePlaceholder')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-checkout">
                  <label className="form-label-checkout">
                    <Phone size={16} />
                    <span>{t('phone')} <span style={{ color: 'var(--red)' }}>*</span></span>
                  </label>
                  <input 
                    type="tel" 
                    className="checkout-form-input" 
                    placeholder={t('phonePlaceholder')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-checkout full-width">
                  <label className="form-label-checkout">
                    <MapPin size={16} />
                    <span>{t('address')} <span style={{ color: 'var(--red)' }}>*</span></span>
                  </label>
                  <input 
                    type="text" 
                    className="checkout-form-input" 
                    placeholder={t('addressPlaceholder')}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Selector */}
            <div className="checkout-section-card">
              <h3 className="checkout-sec-title">
                <span className="step-badge">2</span>
                <span>{t('step2')}</span>
              </h3>

              <div className="payment-type-label">{t('payType')}</div>
              
              <div className="pay-type-cards-grid">
                {/* Cash on Delivery Card */}
                <div 
                  className={`pay-type-card ${paymentType === 'cod' ? 'active' : ''}`}
                  onClick={() => setPaymentType('cod')}
                >
                  <div className="pay-card-radio">
                    <span className="radio-circle"></span>
                  </div>
                  <div className="pay-card-content">
                    <h4 className="pay-card-title">{t('cod')}</h4>
                    <p className="pay-card-desc">{t('codDesc')}</p>
                  </div>
                </div>

                {/* Pay Now Card */}
                <div 
                  className={`pay-type-card ${paymentType === 'now' ? 'active' : ''}`}
                  onClick={() => setPaymentType('now')}
                >
                  <div className="pay-card-radio">
                    <span className="radio-circle"></span>
                  </div>
                  <div className="pay-card-content">
                    <h4 className="pay-card-title">{t('payNow')}</h4>
                    <p className="pay-card-desc">{t('payNowDesc')}</p>
                  </div>
                </div>
              </div>

              {/* Pay Now Details */}
              {paymentType === 'now' && (
                <div className="pay-now-expanded-section animate-fade-in">
                  
                  {/* Amount Choice: Full vs Deposit */}
                  <div className="payment-amount-options-container">
                    <div className="payment-type-label">{t('payAmtOption')}</div>
                    <div className="amt-options-grid">
                      {/* Full Amount Option */}
                      <div 
                        className={`amt-option-card ${payOption === 'full' ? 'active' : ''}`}
                        onClick={() => setPayOption('full')}
                      >
                        <h5 className="amt-title">{t('payFull')}</h5>
                        <p className="amt-desc">{t('payFullDesc')}</p>
                      </div>

                      {/* Deposit Option */}
                      <div 
                        className={`amt-option-card ${payOption === 'deposit' ? 'active' : ''} ${hasOfferItems ? 'disabled' : ''}`}
                        onClick={() => {
                          if (!hasOfferItems) setPayOption('deposit');
                        }}
                      >
                        <h5 className="amt-title">{t('payDeposit')}</h5>
                        <p className="amt-desc">{t('payDepositDesc')}</p>
                        {hasOfferItems && (
                          <div className="offer-restriction-badge">
                            <AlertTriangle size={12} />
                            <span>{isAr ? 'عروض فقط' : 'Offers only'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {hasOfferItems && (
                      <div className="checkout-alert-warning">
                        <AlertTriangle size={16} />
                        <span>{t('offerRestriction')}</span>
                      </div>
                    )}

                    {/* Deposit Percentage Slider */}
                    {payOption === 'deposit' && !hasOfferItems && (
                      <div className="deposit-slider-box animate-fade-in">
                        <div className="slider-label-row">
                          <span>{t('depositLabel')}: <strong>{depositPercent}%</strong></span>
                          <span>{t('dueNow')}: <strong>{Math.round(total * (depositPercent / 100)).toLocaleString()} {t('egp')}</strong></span>
                        </div>
                        <input 
                          type="range" 
                          min="25" 
                          max="100" 
                          step="5"
                          value={depositPercent}
                          onChange={(e) => setDepositPercent(Number(e.target.value))}
                          className="deposit-range-slider"
                        />
                        <div className="slider-ticks">
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className="checkout-divider" />

                  {/* Payment Channel: InstaPay vs Vodafone Cash */}
                  <div className="payment-channels-container">
                    <div className="payment-type-label">{t('payMethod')}</div>
                    <div className="channels-grid">
                      {/* InstaPay */}
                      <div 
                        className={`channel-card ${paymentMethod === 'instapay' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('instapay')}
                      >
                        <TrendingUp size={20} className="channel-icon text-blue" />
                        <div className="channel-info-box">
                          <span className="channel-title">{t('instapay')}</span>
                          <span className="channel-desc">{t('instapayDesc')}</span>
                        </div>
                      </div>

                      {/* Vodafone Cash */}
                      <div 
                        className={`channel-card ${paymentMethod === 'vf_cash' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('vf_cash')}
                      >
                        <Wallet size={20} className="channel-icon text-red" />
                        <div className="channel-info-box">
                          <span className="channel-title">{t('vfCash')}</span>
                          <span className="channel-desc">{t('vfCashDesc')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Transfer Details Card */}
                    <div className="transfer-details-card">
                      <div className="transfer-card-header">
                        <CreditCard size={18} />
                        <strong>{t('transferInstructions')}</strong>
                      </div>
                      
                      <div className="transfer-body">
                        {paymentMethod === 'instapay' ? (
                          <>
                            <p>{t('instapayInstructions')}</p>
                            <div className="copy-action-row">
                              <code className="transfer-value">golden@instapay</code>
                              <button 
                                type="button" 
                                className="btn-copy"
                                onClick={() => handleCopy('golden@instapay')}
                              >
                                {copiedText ? t('copied') : t('transferCopy')}
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p>{t('vfInstructions')}</p>
                            <div className="copy-action-row">
                              <code className="transfer-value">01111926799</code>
                              <button 
                                type="button" 
                                className="btn-copy"
                                onClick={() => handleCopy('01111926799')}
                              >
                                {copiedText ? t('copied') : t('transferCopy')}
                              </button>
                            </div>
                          </>
                        )}
                        
                        <div className="amount-transfer-callout">
                          <span>{t('dueNow')}: </span>
                          <strong>{dueNow.toLocaleString()} {t('egp')}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Reference Number input */}
                    <div className="form-group-checkout" style={{ marginTop: '20px' }}>
                      <label className="form-label-checkout">
                        <CreditCard size={16} />
                        <span>{t('referenceNumber')} <span style={{ color: 'var(--red)' }}>*</span></span>
                      </label>
                      <input 
                        type="text" 
                        className="checkout-form-input" 
                        placeholder={t('referencePlaceholder')}
                        value={refNumber}
                        onChange={(e) => setRefNumber(e.target.value)}
                        required={paymentType === 'now'}
                      />
                    </div>
                  </div>

                </div>
              )}
            </div>
          </form>

          {/* Cart Summary Side Panel */}
          <div className="checkout-summary-panel">
            <div className="summary-sticky-card">
              <h3 className="summary-panel-title">
                <ShoppingBag size={18} />
                <span>{t('orderSummary')}</span>
                <span className="summary-count-badge">{cartList.length}</span>
              </h3>

              {/* Items List */}
              <div className="summary-items-list">
                {cartList.map((item) => (
                  <div key={item.product.id} className="summary-item-row-card">
                    <img 
                      src={item.product.image?.startsWith('data:') ? item.product.image : imageMap[item.product.image]} 
                      alt={item.product.name} 
                      className="summary-item-img"
                      style={getProductImageStyle(item.product.id)}
                    />
                    <div className="summary-item-info">
                      <h4 className="summary-item-name">{item.product.name}</h4>
                      <div className="summary-item-price-qty">
                        <span>{item.quantity} × {item.product.price.toLocaleString()} {t('egp')}</span>
                        <strong>{(item.product.price * item.quantity).toLocaleString()} {t('egp')}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price calculations */}
              <div className="summary-pricing-details">
                <div className="pricing-row">
                  <span>{t('subtotal')}</span>
                  <span>{subtotal.toLocaleString()} {t('egp')}</span>
                </div>
                <div className="pricing-row">
                  <span>{t('shipping')}</span>
                  <span>{shipping.toLocaleString()} {t('egp')}</span>
                </div>
                <div className="pricing-row">
                  <span>{t('tax')}</span>
                  <span>{tax.toLocaleString()} {t('egp')}</span>
                </div>
                
                <hr className="summary-divider" />
                
                <div className="pricing-row total">
                  <span>{t('total')}</span>
                  <span>{total.toLocaleString()} {t('egp')}</span>
                </div>

                {/* Due now / later breakups */}
                {paymentType === 'now' && (
                  <div className="payment-breakdown-box animate-fade-in">
                    <div className="pricing-row due-now-row">
                      <span>{t('dueNow')}</span>
                      <strong>{dueNow.toLocaleString()} {t('egp')}</strong>
                    </div>
                    {dueOnDelivery > 0 && (
                      <div className="pricing-row due-later-row">
                        <span>{t('dueOnDelivery')}</span>
                        <span>{dueOnDelivery.toLocaleString()} {t('egp')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Place Order CTA */}
              <button 
                type="button" 
                onClick={handleSubmit}
                disabled={isSubmitting || !fullName || !phone || !address || (paymentType === 'now' && !refNumber)}
                className="btn-primary checkout-submit-action-btn"
                style={{ width: '100%', marginTop: '24px', py: '14px' }}
              >
                {isSubmitting ? (
                  <span>{t('processing')}</span>
                ) : (
                  <span>{paymentType === 'now' ? t('confirmOrder') : t('confirmCOD')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
