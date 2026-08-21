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
import PaymentSimulator from './PaymentSimulator';

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
    payNow: 'Secure Online Payment (Auto Confirmation)',
    payNowDesc: 'Pay instantly via InstaPay or Mobile Wallets with auto-activation',
    payAmtOption: 'Payment Amount Option',
    payFull: 'Pay Full Amount',
    payFullDesc: 'Pay 100% of the total amount now',
    payDeposit: 'Pay Deposit (Minimum 25%)',
    payDepositDesc: 'Pay a deposit now and the rest on delivery',
    depositLabel: 'Deposit Percentage',
    minDepositWarning: 'Deposit must be at least 25% of the total value',
    offerRestriction: 'Offer items in cart must be paid in full (Deposit disabled)',
    payMethod: 'Select Secure Payment Channel',
    instapay: 'InstaPay IPN Network',
    instapayDesc: 'Instant bank transfer using IPA or dynamic QR Code',
    vfCash: 'Vodafone Cash & Mobile Wallets',
    vfCashDesc: 'Pay instantly via Vodafone Cash, Orange, Etisalat, or Meeza',
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
    payNow: 'الدفع الإلكتروني الآمن (تأكيد تلقائي)',
    payNowDesc: 'ادفع فوراً عبر انستا باي أو المحافظ الإلكترونية لتفعيل الطلب تلقائياً',
    payAmtOption: 'خيار قيمة الدفع',
    payFull: 'دفع المبلغ كاملاً',
    payFullDesc: 'دفع 100% من إجمالي الفاتورة الآن',
    payDeposit: 'دفع عربون (بحد أدنى 25%)',
    payDepositDesc: 'ادفع عربون لتأكيد الطلب والباقي عند الاستلام',
    depositLabel: 'نسبة العربون',
    minDepositWarning: 'يجب أن يكون العربون 25% على الأقل من قيمة السلة',
    offerRestriction: 'المنتجات التي عليها عروض تتطلب دفع المبلغ كاملاً (تم إيقاف خيار العربون)',
    payMethod: 'اختر طريقة الدفع الإلكتروني الآمن',
    instapay: 'شبكة انستا باي (InstaPay IPN)',
    instapayDesc: 'دفع بنكي لحظي مباشر عبر عنوان الدفع أو الرمز السريع QR Code',
    vfCash: 'فودافون كاش والمحافظ الإلكترونية',
    vfCashDesc: 'ادفع بمحفظة فودافون، أورانج، اتصالات أو ميزة الرقمية للتحصيل الإلكتروني',
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
  const [showSimulator, setShowSimulator] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [realPaymentUrl, setRealPaymentUrl] = useState('');
  
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

  // Polling for real Paymob payment status
  useEffect(() => {
    let intervalId;
    if (realPaymentUrl && orderId && !isSuccess) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`/api/payments/status/${orderId}`);
          const data = await res.json();
          if (res.ok && data.status === 'paid') {
            clearInterval(intervalId);
            setRealPaymentUrl('');
            setIsSuccess(true);
            onClearCart();
          }
        } catch (e) {
          console.error("Error polling payment status:", e);
        }
      }, 2500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [realPaymentUrl, orderId, isSuccess]);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address) return;

    if (paymentType === 'cod') {
      const generatedOrderId = `GD-${Math.floor(Math.random() * 90000) + 10000}`;
      setOrderId(generatedOrderId);
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
      try {
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: dueNow,
            paymentMethod,
            payOption,
            depositPercent,
            cartItems: cartList.map(item => ({ id: item.product.id, name: item.product.name, quantity: item.quantity, price: item.product.price })),
            customerInfo: { fullName, phone, address }
          })
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setOrderId(data.orderId);
          if (data.isReal && data.redirectUrl) {
            setRealPaymentUrl(data.redirectUrl);
          } else {
            setShowSimulator(true);
          }
        } else {
          alert(isAr ? 'عذراً، فشل إنشاء عملية الدفع الإلكتروني.' : 'Failed to initialize electronic payment.');
          setIsSubmitting(false);
        }
      } catch (err) {
        alert(isAr ? 'خطأ في الاتصال بالخادم.' : 'Connection error.');
        setIsSubmitting(false);
      }
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
      paymentDetails = `${methodText} (${optionText}) - المدفوع: ${dueNow.toLocaleString()} ${t('egp')} - المتبقي: ${dueOnDelivery.toLocaleString()} ${t('egp')} [تم السداد تلقائياً عبر GOLDEN PAY]`;
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
              onClick={() => setShowInvoice(true)}
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <CreditCard size={18} />
              <span>{isAr ? 'عرض وطباعة الفاتورة' : 'View & Print Invoice'}</span>
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

  // --- Invoice Modal for printing/downloading ---
  const InvoiceModal = () => {
    const today = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="invoice-overlay no-print" onClick={() => setShowInvoice(false)}>
        <div className="invoice-modal-card invoice-print-area" onClick={(e) => e.stopPropagation()}>
          {/* Invoice Header */}
          <div className="invoice-header">
            <div className="invoice-logo-section">
              <h2 className="invoice-logo">GOLDEN <span style={{ color: 'var(--red)' }}>CAR</span></h2>
              <p className="invoice-store-sub">{isAr ? 'قطع غيار واكسسوارات سيارات فاخرة' : 'Premium Auto Parts & Accessories'}</p>
            </div>
            <div className="invoice-meta-section" style={{ textAlign: isAr ? 'left' : 'right' }}>
              <h3>{isAr ? 'فاتورة شراء' : 'INVOICE'}</h3>
              <p><strong>{isAr ? 'رقم الفاتورة:' : 'Invoice No:'}</strong> {orderId}</p>
              <p><strong>{isAr ? 'التاريخ:' : 'Date:'}</strong> {today}</p>
            </div>
          </div>

          <hr className="invoice-divider" />

          {/* Billing & Shipping Info */}
          <div className="invoice-details-grid">
            <div className="details-col">
              <h4>{isAr ? 'العميل:' : 'Customer:'}</h4>
              <p><strong>{fullName}</strong></p>
              <p>{phone}</p>
              <p>{address}</p>
            </div>
            <div className="details-col" style={{ textAlign: isAr ? 'left' : 'right' }}>
              <h4>{isAr ? 'بيانات الشحن:' : 'Shipped By:'}</h4>
              <p><strong>GOLDEN CAR STORES</strong></p>
              <p>+20 111 192 6799</p>
              <p>{isAr ? '12 شارع البطل أحمد عبد العزيز، المهندسين، الجيزة' : '12 El-Batal Ahmed Abdel Aziz, Mohandessin, Giza'}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="invoice-table-wrapper">
            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th style={{ textAlign: isAr ? 'right' : 'left' }}>{isAr ? 'المنتج' : 'Item'}</th>
                  <th style={{ textAlign: 'center' }}>{isAr ? 'الكمية' : 'Qty'}</th>
                  <th style={{ textAlign: isAr ? 'left' : 'right' }}>{isAr ? 'سعر الوحدة' : 'Price'}</th>
                  <th style={{ textAlign: isAr ? 'left' : 'right' }}>{isAr ? 'الإجمالي' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                {cartList.map((item) => (
                  <tr key={item.product.id}>
                    <td style={{ textAlign: isAr ? 'right' : 'left' }}>{isAr ? (item.product.nameAr || item.product.name) : item.product.name}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: isAr ? 'left' : 'right' }}>{item.product.price.toLocaleString()} {t('egp')}</td>
                    <td style={{ textAlign: isAr ? 'left' : 'right' }}>{(item.product.price * item.quantity).toLocaleString()} {t('egp')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Details */}
          <div className="invoice-summary-section">
            <div className="invoice-payment-status">
              {paymentType === 'now' ? (
                <div className="status-stamp paid">
                  <span>{isAr ? 'تم الدفع إلكترونياً' : 'PAID ELECTRONICALLY'}</span>
                  <small style={{ display: 'block', fontSize: '10px', marginTop: '2px', opacity: 0.8 }}>
                    {paymentMethod === 'instapay' ? 'InstaPay' : 'Vodafone Cash'}
                  </small>
                </div>
              ) : (
                <div className="status-stamp cod">
                  <span>{isAr ? 'الدفع عند الاستلام' : 'CASH ON DELIVERY'}</span>
                </div>
              )}
            </div>

            <div className="invoice-totals-box">
              <div className="total-row-inv">
                <span>{t('subtotal')}</span>
                <span>{subtotal.toLocaleString()} {t('egp')}</span>
              </div>
              <div className="total-row-inv">
                <span>{t('shipping')}</span>
                <span>{shipping.toLocaleString()} {t('egp')}</span>
              </div>
              <div className="total-row-inv">
                <span>{t('tax')}</span>
                <span>{tax.toLocaleString()} {t('egp')}</span>
              </div>
              <hr style={{ margin: '8px 0', borderColor: 'rgba(255,255,255,0.08)' }} />
              <div className="total-row-inv grand-total">
                <span>{t('total')}</span>
                <span>{total.toLocaleString()} {t('egp')}</span>
              </div>

              {paymentType === 'now' && (
                <>
                  <div className="total-row-inv due-now">
                    <span>{t('dueNow')}</span>
                    <span>{dueNow.toLocaleString()} {t('egp')}</span>
                  </div>
                  {dueOnDelivery > 0 && (
                    <div className="total-row-inv remaining">
                      <span>{t('dueOnDelivery')}</span>
                      <span>{dueOnDelivery.toLocaleString()} {t('egp')}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Invoice Actions (No Print) */}
          <div className="invoice-modal-actions no-print">
            <button className="btn-sim-outline" onClick={() => setShowInvoice(false)}>
              {isAr ? 'إغلاق' : 'Close'}
            </button>
            <button className="btn-sim-primary" onClick={() => window.print()}>
              {isAr ? 'طباعة الفاتورة' : 'Print Invoice'}
            </button>
          </div>

        </div>

        <style>{`
          .invoice-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
            overflow-y: auto;
          }
          .invoice-modal-card {
            background: #111;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            width: 100%;
            max-width: 700px;
            padding: 30px;
            box-shadow: 0 15px 30px rgba(0,0,0,0.5);
            color: #fff;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .invoice-logo {
            font-family: var(--font-display);
            font-size: 26px;
            letter-spacing: 1px;
            margin: 0;
          }
          .invoice-store-sub {
            font-size: 12px;
            color: #888;
            margin: 4px 0 0 0;
          }
          .invoice-meta-section h3 {
            margin: 0 0 8px 0;
            font-size: 20px;
            color: var(--red);
          }
          .invoice-meta-section p {
            font-size: 13px;
            color: #aaa;
            margin: 3px 0;
          }
          .invoice-divider {
            border: 0;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            margin: 20px 0;
          }
          .invoice-details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
          }
          .details-col h4 {
            font-size: 14px;
            color: #888;
            margin: 0 0 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .details-col p {
            font-size: 13px;
            color: #ccc;
            margin: 4px 0;
            line-height: 1.5;
          }
          .invoice-table-wrapper {
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            overflow: hidden;
          }
          .invoice-items-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          .invoice-items-table th {
            background: #181818;
            color: #888;
            padding: 10px 14px;
            font-weight: 600;
          }
          .invoice-items-table td {
            padding: 12px 14px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: #ddd;
          }
          .invoice-items-table tr:last-child td {
            border-bottom: none;
          }
          .invoice-summary-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 24px;
            gap: 20px;
          }
          .status-stamp {
            border: 2px solid currentColor;
            border-radius: 6px;
            padding: 10px 16px;
            font-weight: 800;
            font-size: 14px;
            letter-spacing: 1px;
            transform: rotate(-5deg);
            display: inline-block;
          }
          .status-stamp.paid {
            color: #2ecc71;
            background: rgba(46, 204, 113, 0.05);
          }
          .status-stamp.cod {
            color: #f39c12;
            background: rgba(243, 156, 18, 0.05);
          }
          .invoice-totals-box {
            width: 100%;
            max-width: 300px;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .total-row-inv {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            color: #aaa;
          }
          .total-row-inv.grand-total {
            color: #fff;
            font-weight: 700;
            font-size: 15px;
          }
          .total-row-inv.due-now {
            color: #2ecc71;
            font-weight: 700;
            margin-top: 4px;
          }
          .total-row-inv.remaining {
            color: #aaa;
            font-size: 12px;
          }
          .invoice-modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 20px;
          }
          
          /* Print Stylesheet Overrides */
          @media print {
            body * {
              visibility: hidden !important;
            }
            .invoice-print-area, .invoice-print-area * {
              visibility: visible !important;
            }
            .invoice-print-area {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              background: #fff !important;
              color: #000 !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .invoice-print-area td, .invoice-print-area p, .invoice-print-area strong, .invoice-print-area span, .invoice-print-area h2, .invoice-print-area h3 {
              color: #000 !important;
            }
            .invoice-items-table th {
              background: #f0f0f0 !important;
              color: #333 !important;
            }
            .invoice-divider {
              border-top: 1px solid #ccc !important;
            }
            .invoice-table-wrapper {
              border: 1px solid #ccc !important;
            }
            .invoice-items-table td {
              border-bottom: 1px solid #eee !important;
            }
            .status-stamp.paid {
              color: #27ae60 !important;
              border-color: #27ae60 !important;
            }
            .status-stamp.cod {
              color: #d35400 !important;
              border-color: #d35400 !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </div>
    );
  };

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

                    {/* Automated Payment Notice */}
                    <div className="gateway-notice-card" style={{
                      background: 'rgba(227, 30, 36, 0.04)',
                      border: '1px dashed var(--border-red)',
                      borderRadius: 'var(--radius)',
                      padding: '16px',
                      marginTop: '16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <Check size={20} style={{ color: 'var(--green)', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: 'var(--text)', fontWeight: 'bold' }}>
                          {isAr ? 'الدفع الإلكتروني التلقائي الآمن' : 'Secure Electronic Automated Payment'}
                        </strong>
                        <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.5', margin: 0 }}>
                          {isAr 
                            ? `سيتم فتح نافذة الدفع الآمنة (GOLDEN PAY) لإتمام سداد مبلغ قدره ${dueNow.toLocaleString()} ج.م عبر ${paymentMethod === 'instapay' ? 'تطبيق InstaPay' : 'محفظة فودافون كاش'} تلقائياً فور النقر على زر تأكيد الطلب بالأسفل.`
                            : `A secure payment window (GOLDEN PAY) will launch to process your payment of ${dueNow.toLocaleString()} EGP via ${paymentMethod === 'instapay' ? 'InstaPay App' : 'Vodafone Cash Wallet'} immediately after clicking the place order button.`
                          }
                        </p>
                      </div>
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
                disabled={isSubmitting || !fullName || !phone || !address}
                className="btn-primary checkout-submit-action-btn"
                style={{ width: '100%', marginTop: '24px', py: '14px' }}
              >
                {isSubmitting ? (
                  <span>{t('processing')}</span>
                ) : (
                  <span>
                    {paymentType === 'now' 
                      ? (isAr 
                          ? `ادفع ${dueNow.toLocaleString()} ج.م الآن عبر ${paymentMethod === 'instapay' ? 'انستا باي' : 'فودافون كاش'}`
                          : `Pay ${dueNow.toLocaleString()} EGP Now via ${paymentMethod === 'instapay' ? 'InstaPay' : 'Vodafone Cash'}`
                        )
                      : t('confirmCOD')
                    }
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSimulator && (
        <PaymentSimulator 
          orderId={orderId}
          amount={dueNow}
          paymentMethod={paymentMethod}
          customerInfo={{ fullName, phone, address }}
          isAr={isAr}
          onSuccess={(confirmedOrderId) => {
            setShowSimulator(false);
            setIsSubmitting(false);
            setIsSuccess(true);
            onClearCart();
          }}
          onCancel={() => {
            setShowSimulator(false);
            setIsSubmitting(false);
          }}
        />
      )}
      {showInvoice && <InvoiceModal />}

      {realPaymentUrl && (
        <div className="real-payment-overlay no-print">
          <div className="real-payment-modal">
            <div className="real-payment-header">
              <h3>{isAr ? 'بوابة الدفع الآمنة (GOLDEN PAY)' : 'Secure Payment (GOLDEN PAY)'}</h3>
              <button className="close-payment-btn" onClick={() => {
                setRealPaymentUrl('');
                setIsSubmitting(false);
              }}>
                {isAr ? 'إلغاء والرجوع' : 'Cancel & Go Back'}
              </button>
            </div>
            <iframe 
              src={realPaymentUrl} 
              title="Secure Checkout" 
              className="secure-payment-iframe"
            />
          </div>
          <style>{`
            .real-payment-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.85);
              backdrop-filter: blur(8px);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 10000;
              padding: 20px;
            }
            .real-payment-modal {
              background: #111;
              border: 1px solid rgba(255,255,255,0.12);
              border-radius: 16px;
              width: 100%;
              max-width: 600px;
              height: 80vh;
              display: flex;
              flex-direction: column;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            }
            .real-payment-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px 20px;
              background: #181818;
              border-bottom: 1px solid rgba(255,255,255,0.05);
            }
            .real-payment-header h3 {
              margin: 0;
              font-size: 14px;
              font-weight: 600;
              color: var(--text);
            }
            .close-payment-btn {
              background: transparent;
              border: 1px solid rgba(255,255,255,0.15);
              color: var(--text-2);
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              cursor: pointer;
              transition: var(--t);
            }
            .close-payment-btn:hover {
              color: #ff3038;
              border-color: #ff3038;
              background: rgba(227, 30, 36, 0.05);
            }
            .secure-payment-iframe {
              width: 100%;
              flex: 1;
              border: none;
              background: #fff;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
