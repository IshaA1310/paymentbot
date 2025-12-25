import React, { useState, useCallback, useEffect } from 'react';
import useRazorpay from '../hooks/useRazorpay';
import api from '../utils/api';

const BuyCreditsButton = ({ 
  onSuccess,
  onError,
  className = '',
  buttonText = 'Proceed to Payment'
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  
  const { isLoaded, isLoading: scriptLoading, error: scriptError } = useRazorpay();

  useEffect(() => {
    if (scriptError) {
      setMessage({
        type: 'error',
        text: scriptError.message || 'Failed to load payment gateway. Please refresh the page.'
      });
      if (onError) {
        onError(scriptError);
      }
    }
  }, [scriptError, onError]);

  const validateInputs = () => {
    if (!phoneNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter your phone number' });
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phoneNumber.trim())) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number' });
      return false;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount (minimum ₹1)' });
      return false;
    }
    if (parseFloat(amount) < 1) {
      setMessage({ type: 'error', text: 'Minimum amount is ₹1' });
      return false;
    }
    return true;
  };

  const handlePaymentVerification = useCallback(async (razorpayResponse, orderId) => {
    try {
      setLoading(true);

      const { data: verificationData } = await api.post('/api/payment/verify', {
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        orderId: orderId,
        phoneNumber: phoneNumber.trim(),
      });

      setLoading(false);
      
      setMessage({ 
        type: 'success', 
        text: 'Payment successful! Credits have been added to your account.' 
      });

      if (onSuccess) {
        onSuccess(verificationData);
      }

      // Clear form and success message after 5 seconds
      setTimeout(() => {
        setMessage({ type: null, text: '' });
        setPhoneNumber('');
        setAmount('');
      }, 5000);

    } catch (error) {
      console.error('Error verifying payment:', error);
      setLoading(false);
      
      // Extract error message from axios error response
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Payment verification failed. Please contact support.';
      
      setMessage({ 
        type: 'error', 
        text: errorMessage 
      });
      if (onError) {
        onError(error);
      }
    }
  }, [phoneNumber, onSuccess, onError]);

  /**
   * Create order on backend and initialize Razorpay checkout
   */
  const handleBuyCredits = async () => {
    // Validate inputs
    if (!validateInputs()) {
      return;
    }

    // Check if Razorpay script is loaded
    if (!isLoaded) {
      if (scriptLoading) {
        setMessage({
          type: 'info',
          text: 'Loading payment gateway...'
        });
        return;
      }
      if (scriptError) {
        setMessage({
          type: 'error',
          text: scriptError.message || 'Payment gateway failed to load. Please refresh the page.'
        });
        return;
      }
      setMessage({
        type: 'error',
        text: 'Payment gateway not available. Please refresh the page.'
      });
      return;
    }

    if (!window.Razorpay) {
      setMessage({
        type: 'error',
        text: 'Razorpay SDK not available. Please refresh the page.'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      // Convert amount to credits (1 credit = ₹1, so amount in rupees = credits)
      const credits = Math.floor(parseFloat(amount));
      
      // Step 1: Create order on backend
      const { data: orderData } = await api.post('/api/payment/create-order', {
        credits: credits,
        phoneNumber: phoneNumber.trim(),
      });

      const options = {
        key: orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID, // Razorpay key ID (optional, usually provided by backend)
        amount: orderData.amount, // Amount in paise
        currency: orderData.currency || 'INR',
        name: orderData.name || 'Credit Purchase',
        description: orderData.description || `Purchase ${credits} credits`,
        order_id: orderData.orderId, // Order ID from backend
        handler: function (response) {
          // Step 3: Verify payment on backend
          handlePaymentVerification(response, orderData.orderId);
        },
        prefill: {
          name: orderData.prefill?.name || '',
          email: orderData.prefill?.email || '',
          contact: phoneNumber.trim(),
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function () {
            // Handle payment cancellation
            setLoading(false);
            setMessage({ 
              type: 'info', 
              text: 'Payment cancelled by user' 
            });
            if (onError) {
              onError(new Error('Payment cancelled'));
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        // Handle payment failure
        setLoading(false);
        const errorMessage = response.error?.description || 'Payment failed';
        setMessage({ 
          type: 'error', 
          text: errorMessage 
        });
        if (onError) {
          onError(new Error(errorMessage));
        }
      });

      razorpay.open();
      
    } catch (error) {
      console.error('Error initiating payment:', error);
      setLoading(false);
      
      // Extract error message from axios error response
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to initiate payment. Please try again.';
      
      setMessage({ 
        type: 'error', 
        text: errorMessage 
      });
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <div className={`buy-credits-container ${className}`} style={{ width: '100%' }}>
      {/* Phone Number Input */}
      <div style={{ marginBottom: '24px' }}>
        <label 
          htmlFor="phone-input"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px', 
            fontSize: '14px', 
            fontWeight: '600',
            color: '#374151'
          }}
        >
          <span>📱</span>
          <span>Phone Number</span>
          <span style={{ color: '#ef4444', fontSize: '12px' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="phone-input"
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setPhoneNumber(value);
              setMessage({ type: null, text: '' });
            }}
            placeholder="9876543210"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '16px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              backgroundColor: loading ? '#f9fafb' : '#ffffff',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <div style={{ 
          marginTop: '6px', 
          fontSize: '12px', 
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>ℹ️</span>
          <span>10-digit mobile number (e.g., 9876543210)</span>
        </div>
      </div>

      {/* Amount Input */}
      <div style={{ marginBottom: '24px' }}>
        <label 
          htmlFor="amount-input"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px', 
            fontSize: '14px', 
            fontWeight: '600',
            color: '#374151'
          }}
        >
          <span>💰</span>
          <span>Amount</span>
          <span style={{ color: '#ef4444', fontSize: '12px' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '20px',
            fontWeight: '700',
            color: '#6366f1',
            zIndex: 1
          }}>
            ₹
          </span>
          <input
            id="amount-input"
            type="number"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 1000000)) {
                setAmount(value);
                setMessage({ type: null, text: '' });
              }
            }}
            placeholder="100"
            disabled={loading}
            min="1"
            step="1"
            style={{
              width: '100%',
              padding: '14px 16px 14px 40px',
              fontSize: '18px',
              fontWeight: '600',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              backgroundColor: loading ? '#f9fafb' : '#ffffff',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              color: '#1f2937'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <div style={{ 
          marginTop: '6px', 
          fontSize: '12px', 
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>ℹ️</span>
          <span>Minimum: ₹1 | 1 Credit = ₹1</span>
        </div>
        {amount && parseFloat(amount) > 0 && (
          <div style={{ 
            marginTop: '12px',
            padding: '12px 16px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
            borderRadius: '10px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>✨</span>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                You will receive
              </div>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {Math.floor(parseFloat(amount))} credits
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Purchase Button */}
      <button
        onClick={handleBuyCredits}
        disabled={loading || !isLoaded || scriptLoading || !phoneNumber || !amount}
        className="buy-credits-button"
        style={{
          width: '100%',
          padding: '16px 24px',
          fontSize: '16px',
          fontWeight: '700',
          color: '#ffffff',
          background: (loading || !phoneNumber || !amount) 
            ? 'linear-gradient(135deg, #d1d5db, #9ca3af)' 
            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          borderRadius: '12px',
          cursor: (loading || !phoneNumber || !amount) ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: (loading || !phoneNumber || !amount) 
            ? 'none' 
            : '0 4px 6px -1px rgba(99, 102, 241, 0.3), 0 2px 4px -1px rgba(99, 102, 241, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          if (!loading && !e.target.disabled && phoneNumber && amount) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 10px 15px -3px rgba(99, 102, 241, 0.4), 0 4px 6px -2px rgba(99, 102, 241, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && !e.target.disabled && phoneNumber && amount) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(99, 102, 241, 0.3), 0 2px 4px -1px rgba(99, 102, 241, 0.2)';
          }
        }}
      >
        {loading ? (
          <>
            <span style={{ 
              width: '16px', 
              height: '16px', 
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#ffffff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              display: 'inline-block'
            }} />
            <span>Processing...</span>
          </>
        ) : scriptLoading ? (
          <>
            <span>⏳</span>
            <span>Loading Payment Gateway...</span>
          </>
        ) : !isLoaded ? (
          <>
            <span>🔄</span>
            <span>Initializing...</span>
          </>
        ) : (
          <>
            <span>💳</span>
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {/* Message Display */}
      {message.text && (
        <div
          className="payment-message"
          style={{
            marginTop: '16px',
            padding: '14px 18px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.3s ease-out',
            backgroundColor:
              message.type === 'success'
                ? '#d1fae5'
                : message.type === 'error'
                ? '#fee2e2'
                : '#dbeafe',
            color:
              message.type === 'success'
                ? '#065f46'
                : message.type === 'error'
                ? '#991b1b'
                : '#1e40af',
            border: `2px solid ${
              message.type === 'success'
                ? '#10b981'
                : message.type === 'error'
                ? '#ef4444'
                : '#3b82f6'
            }`,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}
        >
          <span style={{ fontSize: '20px' }}>
            {message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
};

export default BuyCreditsButton;

