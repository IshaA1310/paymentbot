import React from 'react';
import BuyCreditsButton from '../components/BuyCreditsButton.jsx';

const Home = () => {
  const handlePaymentSuccess = (verificationData) => {
    console.log('Payment successful:', verificationData);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      padding: '60px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Payment Modal */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          animation: 'fadeIn 0.6s ease-out'
        }}>
          <BuyCreditsButton
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
