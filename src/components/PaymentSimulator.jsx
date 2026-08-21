import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  QrCode, 
  ShieldCheck, 
  Lock, 
  HelpCircle, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  CreditCard,
  Copy,
  Check
} from 'lucide-react';

export default function PaymentSimulator({ 
  orderId, 
  amount, 
  paymentMethod, // 'vf_cash' | 'instapay'
  customerInfo = {},
  isAr = true, 
  onSuccess, 
  onCancel 
}) {
  const [currentStep, setCurrentStep] = useState('info'); // 'info', 'otp', 'qr', 'processing', 'success', 'failed'
  const [phoneNumber, setPhoneNumber] = useState(customerInfo.phone || '');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-redirect to appropriate payment route on mount
  useEffect(() => {
    if (paymentMethod === 'vf_cash') {
      setCurrentStep('info');
    } else {
      setCurrentStep('qr');
    }
  }, [paymentMethod]);

  // Timer effect for OTP
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0 && currentStep === 'otp') {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer, currentStep]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 11) {
      setErrorMessage(isAr ? 'برجاء إدخال رقم هاتف محفظة صحيح (11 رقم)' : 'Please enter a valid wallet number (11 digits)');
      return;
    }
    setErrorMessage('');
    setCurrentStep('processing');
    setStatusMessage(isAr ? 'جاري إرسال كود التحقق OTP...' : 'Sending verification OTP...');
    
    setTimeout(() => {
      setOtpSent(true);
      setTimer(60);
      setCurrentStep('otp');
    }, 1500);
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    setTimer(60);
    // Simulate resend
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Triggers the backend simulation of the Paymob webhook
  const triggerBackendPayment = async (successStatus) => {
    setCurrentStep('processing');
    setStatusMessage(isAr ? 'جاري التحقق من عملية الدفع وسداد القيمة...' : 'Verifying and processing payment...');
    
    try {
      const response = await fetch('/api/payments/simulate-webhook-trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderId,
          success: successStatus
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setTimeout(() => {
          setCurrentStep('success');
          setTimeout(() => {
            if (onSuccess) onSuccess(orderId);
          }, 2000);
        }, 1500);
      } else {
        setErrorMessage(data.error || (isAr ? 'فشلت عملية الدفع' : 'Payment failed'));
        setCurrentStep('failed');
      }
    } catch (error) {
      setErrorMessage(isAr ? 'عطل في الاتصال بالسيرفر' : 'Server connection error');
      setCurrentStep('failed');
    }
  };

  return (
    <div className="payment-sim-overlay animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="payment-sim-container">
        
        {/* Header */}
        <div className="payment-sim-header">
          <div className="brand-logo-sim">
            <span className="logo-red-dot"></span>
            <span className="brand-title">GOLDEN <span className="brand-accent">PAY</span></span>
          </div>
          <div className="secure-badge">
            <ShieldCheck size={16} className="secure-icon" />
            <span>{isAr ? 'مدعوم من ميزة وبنك مصر' : 'Powered by Meeza & BM'}</span>
          </div>
        </div>

        {/* Order Brief */}
        <div className="payment-sim-brief">
          <div className="brief-col">
            <span className="brief-label">{isAr ? 'رقم الطلب' : 'Order ID'}</span>
            <span className="brief-value">{orderId}</span>
          </div>
          <div className="brief-col" style={{ textAlign: isAr ? 'left' : 'right' }}>
            <span className="brief-label">{isAr ? 'المبلغ المستحق' : 'Amount Due'}</span>
            <span className="brief-value price-highlight">{amount.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="payment-sim-content">
          
          {currentStep === 'info' && (
            <div className="sim-step-view">
              <div className="payment-method-indicator">
                <Smartphone size={32} className="method-icon-vf" />
                <div>
                  <h4>{isAr ? 'الدفع عن طريق محفظة الهاتف' : 'Pay via Mobile Wallet'}</h4>
                  <p>{isAr ? 'ادخل رقم فودافون كاش أو أي محفظة مصرية' : 'Enter your Vodafone Cash or any Egyptian Wallet'}</p>
                </div>
              </div>

              <form onSubmit={handleSendOtp} className="sim-form">
                <div className="form-group-sim">
                  <label>{isAr ? 'رقم الهاتف المحمول' : 'Mobile Wallet Number'}</label>
                  <div className="input-with-prefix">
                    <span className="phone-prefix">+20</span>
                    <input 
                      type="tel" 
                      placeholder="01xxxxxxxxx" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      required 
                    />
                  </div>
                  {errorMessage && <span className="error-text-sim">{errorMessage}</span>}
                </div>

                <button type="submit" className="btn-sim-primary">
                  {isAr ? 'إرسال رمز التحقق OTP' : 'Send Verification OTP'}
                </button>
              </form>
            </div>
          )}

          {currentStep === 'otp' && (
            <div className="sim-step-view">
              <div className="otp-info-header">
                <h4>{isAr ? 'أدخل رمز التحقق (OTP)' : 'Enter OTP Verification Code'}</h4>
                <p>
                  {isAr 
                    ? `تم إرسال رمز مكون من 6 أرقام إلى الرقم ${phoneNumber}`
                    : `We sent a 6-digit code to wallet number ${phoneNumber}`}
                </p>
              </div>

              <div className="sim-form">
                <div className="form-group-sim" style={{ textAlign: 'center' }}>
                  <input 
                    type="text" 
                    className="otp-input-box"
                    placeholder="1 2 3 4 5 6"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                  <div className="otp-timer-row">
                    {timer > 0 ? (
                      <span>{isAr ? `إعادة الإرسال خلال ${timer} ثانية` : `Resend in ${timer}s`}</span>
                    ) : (
                      <button type="button" onClick={handleResendOtp} className="resend-otp-btn">
                        {isAr ? 'إعادة إرسال الكود' : 'Resend Code'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="actions-row-sim">
                  <button 
                    type="button" 
                    className="btn-sim-outline" 
                    onClick={() => setCurrentStep('info')}
                  >
                    {isAr ? 'تعديل الرقم' : 'Edit Number'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-sim-primary"
                    disabled={otp.length < 6}
                    onClick={() => triggerBackendPayment(true)}
                  >
                    {isAr ? 'تأكيد ودفع' : 'Confirm & Pay'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'qr' && (
            <div className="sim-step-view text-center">
              <div className="payment-method-indicator justify-center">
                <QrCode size={32} className="method-icon-insta" />
                <div>
                  <h4>{isAr ? 'الدفع الفوري عبر شبكة انستا باي' : 'Instant Payment via InstaPay'}</h4>
                  <p>{isAr ? 'امسح رمز الاستجابة السريع للدفع الفوري والتلقائي' : 'Scan the QR code to pay instantly and automatically'}</p>
                </div>
              </div>

              {/* Dynamic Simulated Meeza/InstaPay QR Code */}
              <div className="qr-container-sim">
                <svg className="sim-qr-svg" viewBox="0 0 100 100" width="180" height="180">
                  {/* Outer border & styling mimicking Meeza IPN QR */}
                  <rect x="0" y="0" width="100" height="100" fill="#fff" rx="4" />
                  {/* QR Mockup patterns */}
                  <rect x="10" y="10" width="20" height="20" fill="#3b0f59" />
                  <rect x="13" y="13" width="14" height="14" fill="#fff" />
                  <rect x="16" y="16" width="8" height="8" fill="#3b0f59" />

                  <rect x="70" y="10" width="20" height="20" fill="#3b0f59" />
                  <rect x="73" y="13" width="14" height="14" fill="#fff" />
                  <rect x="76" y="16" width="8" height="8" fill="#3b0f59" />

                  <rect x="10" y="70" width="20" height="20" fill="#3b0f59" />
                  <rect x="13" y="73" width="14" height="14" fill="#fff" />
                  <rect x="16" y="76" width="8" height="8" fill="#3b0f59" />

                  {/* Random dots to make it look like a QR code */}
                  <rect x="35" y="15" width="5" height="5" fill="#3b0f59" />
                  <rect x="45" y="10" width="10" height="5" fill="#3b0f59" />
                  <rect x="40" y="25" width="5" height="5" fill="#3b0f59" />
                  <rect x="55" y="20" width="5" height="15" fill="#3b0f59" />
                  
                  <rect x="15" y="35" width="5" height="5" fill="#3b0f59" />
                  <rect x="25" y="40" width="15" height="5" fill="#3b0f59" />
                  <rect x="10" y="50" width="10" height="10" fill="#3b0f59" />
                  
                  <rect x="75" y="35" width="10" height="5" fill="#3b0f59" />
                  <rect x="70" y="45" width="5" height="10" fill="#3b0f59" />
                  <rect x="85" y="50" width="5" height="15" fill="#3b0f59" />

                  <rect x="35" y="40" width="30" height="30" fill="#E31E24" opacity="0.1" />
                  {/* Central Meeza/IPN icon mockup */}
                  <circle cx="50" cy="50" r="10" fill="#E31E24" />
                  <path d="M47 48h6v4h-6z" fill="#fff" />
                </svg>
                <div className="qr-brand-label">IPN / MEEZA DIGITAL</div>
              </div>

              <div className="ipa-info-box">
                <span className="ipa-label">{isAr ? 'عنوان انستا باي (IPA):' : 'InstaPay IPA Address:'}</span>
                <div className="ipa-value-row">
                  <code>golden@instapay</code>
                  <button className="copy-btn-sim" onClick={() => handleCopy('golden@instapay')}>
                    {copied ? <Check size={14} color="#2ecc71" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="sim-helper-text">
                {isAr 
                  ? 'يرجى فتح تطبيق انستا باي وهاتف العميل والمسح للإتمام.' 
                  : 'Please scan from the customer\'s InstaPay App to complete.'}
              </div>

              <button 
                type="button" 
                className="btn-sim-primary"
                onClick={() => triggerBackendPayment(true)}
              >
                {isAr ? 'محاكاة تأكيد الدفع الفوري (نجاح)' : 'Simulate Instant Payment (Success)'}
              </button>
            </div>
          )}

          {currentStep === 'processing' && (
            <div className="sim-step-view text-center py-6">
              <div className="spinner-sim">
                <RefreshCw size={48} className="spin-icon" />
              </div>
              <h4 style={{ marginTop: '20px' }}>{isAr ? 'جاري المعالجة الآمنة...' : 'Securing transaction...'}</h4>
              <p style={{ color: 'var(--text-2)', fontSize: '13px' }}>{statusMessage}</p>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="sim-step-view text-center py-6 animate-scale-in">
              <CheckCircle2 size={64} className="status-icon-success" />
              <h3 style={{ color: '#2ecc71', marginTop: '16px' }}>{isAr ? 'تم الدفع بنجاح!' : 'Payment Successful!'}</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '14px', marginTop: '8px' }}>
                {isAr 
                  ? 'تم تأكيد المعاملة مالياً بنجاح وتلقي الويب هوك.' 
                  : 'Transaction confirmed and webhook processed successfully.'}
              </p>
              <div className="sim-secure-seal">
                <Lock size={12} />
                <span>SECURED BY PCI-DSS</span>
              </div>
            </div>
          )}

          {currentStep === 'failed' && (
            <div className="sim-step-view text-center py-6 animate-scale-in">
              <XCircle size={64} className="status-icon-failed" />
              <h3 style={{ color: '#e74c3c', marginTop: '16px' }}>{isAr ? 'فشلت عملية الدفع' : 'Payment Failed'}</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '14px', marginTop: '8px' }}>
                {errorMessage || (isAr ? 'حدث خطأ غير متوقع أثناء معالجة العملية.' : 'An error occurred while processing the transaction.')}
              </p>
              <div className="actions-row-sim justify-center" style={{ marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="btn-sim-outline" 
                  onClick={() => paymentMethod === 'vf_cash' ? setCurrentStep('info') : setCurrentStep('qr')}
                >
                  {isAr ? 'إعادة المحاولة' : 'Try Again'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="payment-sim-footer">
          <div className="pci-compliance">
            <Lock size={14} />
            <span>128-Bit SSL Encryption Secured Connection</span>
          </div>
          {['info', 'otp', 'qr'].includes(currentStep) && (
            <button 
              className="cancel-transaction-btn"
              onClick={() => triggerBackendPayment(false)}
            >
              {isAr ? 'إلغاء المعاملة والرجوع' : 'Cancel Transaction & Back'}
            </button>
          )}
        </div>

      </div>

      <style>{`
        .payment-sim-overlay {
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
          z-index: 9999;
          font-family: var(--font-arabic), var(--font-body), sans-serif;
          padding: 20px;
        }
        .payment-sim-container {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          overflow: hidden;
          color: #eee;
          display: flex;
          flex-direction: column;
        }
        .payment-sim-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          background: #161616;
        }
        .brand-logo-sim {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-red-dot {
          width: 8px;
          height: 8px;
          background: #E31E24;
          border-radius: 50%;
          box-shadow: 0 0 10px #E31E24;
        }
        .brand-title {
          font-weight: 800;
          letter-spacing: 0.5px;
          font-size: 14px;
        }
        .brand-accent {
          color: #E31E24;
        }
        .secure-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #2ecc71;
          background: rgba(46, 204, 113, 0.1);
          padding: 4px 10px;
          border-radius: 20px;
        }
        .secure-icon {
          flex-shrink: 0;
        }
        .payment-sim-brief {
          display: flex;
          justify-content: space-between;
          padding: 16px 20px;
          background: #1a1a1a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .brief-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .brief-label {
          font-size: 11px;
          color: #888;
        }
        .brief-value {
          font-size: 14px;
          font-weight: 600;
        }
        .price-highlight {
          color: #ff3038;
          font-size: 16px;
          font-weight: 700;
        }
        .payment-sim-content {
          padding: 24px 20px;
          background: #111;
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sim-step-view {
          width: 100%;
        }
        .payment-method-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          text-align: right;
        }
        [dir="ltr"] .payment-method-indicator {
          text-align: left;
        }
        .payment-method-indicator.justify-center {
          justify-content: center;
          text-align: center;
          flex-direction: column;
          gap: 8px;
        }
        .method-icon-vf {
          color: #ff3038;
          background: rgba(255, 48, 56, 0.1);
          padding: 6px;
          border-radius: 8px;
        }
        .method-icon-insta {
          color: #3b0f59;
          background: rgba(59, 15, 89, 0.15);
          padding: 6px;
          border-radius: 8px;
        }
        .payment-method-indicator h4 {
          font-size: 15px;
          font-weight: 700;
        }
        .payment-method-indicator p {
          font-size: 12px;
          color: #888;
        }
        .sim-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group-sim {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: right;
        }
        [dir="ltr"] .form-group-sim {
          text-align: left;
        }
        .form-group-sim label {
          font-size: 13px;
          font-weight: 600;
          color: #bbb;
        }
        .input-with-prefix {
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #181818;
          border-radius: 8px;
          overflow: hidden;
          height: 46px;
        }
        .phone-prefix {
          padding: 0 14px;
          background: rgba(255, 255, 255, 0.05);
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          color: #888;
          font-size: 14px;
          font-weight: 600;
          height: 100%;
          display: flex;
          align-items: center;
        }
        [dir="ltr"] .phone-prefix {
          border-left: none;
          border-right: 1px solid rgba(255, 255, 255, 0.15);
        }
        .input-with-prefix input {
          border: none;
          background: transparent;
          color: #fff;
          padding: 0 14px;
          font-size: 15px;
          font-weight: 600;
          width: 100%;
          height: 100%;
          outline: none;
        }
        .error-text-sim {
          color: #e74c3c;
          font-size: 11px;
          margin-top: 4px;
        }
        .btn-sim-primary {
          background: #E31E24;
          color: #fff;
          border: none;
          border-radius: 8px;
          height: 46px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .btn-sim-primary:hover {
          background: #c2191e;
        }
        .btn-sim-primary:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: #666;
          cursor: not-allowed;
        }
        .btn-sim-outline {
          background: transparent;
          color: #bbb;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          height: 46px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
          padding: 0 16px;
        }
        .btn-sim-outline:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        .actions-row-sim {
          display: flex;
          gap: 12px;
        }
        .actions-row-sim button {
          flex: 1;
        }
        .otp-info-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .otp-info-header h4 {
          font-size: 16px;
          font-weight: 700;
        }
        .otp-info-header p {
          font-size: 12px;
          color: #888;
          margin-top: 6px;
        }
        .otp-input-box {
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #181818;
          color: #fff;
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 8px;
          padding: 10px;
          border-radius: 8px;
          width: 200px;
          margin: 0 auto;
          outline: none;
        }
        .otp-timer-row {
          margin-top: 10px;
          font-size: 11px;
          color: #666;
        }
        .resend-otp-btn {
          background: transparent;
          border: none;
          color: #ff3038;
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
        }
        .text-center {
          text-align: center;
        }
        .justify-center {
          justify-content: center;
        }
        .qr-container-sim {
          background: #fff;
          padding: 12px;
          border-radius: 12px;
          display: inline-block;
          margin: 0 auto 16px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }
        .sim-qr-svg {
          display: block;
        }
        .qr-brand-label {
          font-size: 10px;
          font-weight: 800;
          color: #3b0f59;
          margin-top: 6px;
          letter-spacing: 1px;
        }
        .ipa-info-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .ipa-label {
          font-size: 12px;
          color: #888;
        }
        .ipa-value-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ipa-value-row code {
          background: rgba(255,255,255,0.05);
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
          color: #ff3038;
        }
        .copy-btn-sim {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .copy-btn-sim:hover {
          color: #fff;
        }
        .sim-helper-text {
          font-size: 11px;
          color: #666;
          margin-bottom: 20px;
        }
        .py-6 {
          padding-top: 24px;
          padding-bottom: 24px;
        }
        .spinner-sim {
          display: inline-block;
        }
        .spin-icon {
          color: #ff3038;
          animation: spin 1s linear infinite;
        }
        .status-icon-success {
          color: #2ecc71;
          display: block;
          margin: 0 auto;
        }
        .status-icon-failed {
          color: #e74c3c;
          display: block;
          margin: 0 auto;
        }
        .sim-secure-seal {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: #666;
          margin-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 12px;
          width: 100%;
          justify-content: center;
        }
        .payment-sim-footer {
          padding: 16px 20px;
          background: #161616;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }
        .pci-compliance {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: #555;
        }
        .cancel-transaction-btn {
          background: transparent;
          border: none;
          color: #666;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }
        .cancel-transaction-btn:hover {
          color: #ff3038;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
