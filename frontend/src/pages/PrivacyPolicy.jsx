import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '60px 20px',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Privacy Policy
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '30px' }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div style={{ lineHeight: '1.8', color: '#4b5563' }}>
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
              Information We Collect
            </h2>
            <p style={{ fontSize: '15px', marginBottom: '12px' }}>
              We collect your phone number for account creation and payment processing. Payment information 
              is securely processed through Razorpay - we never store your card details.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
              How We Use Your Information
            </h2>
            <p style={{ fontSize: '15px' }}>
              Your information is used solely for processing payments, managing your credit account, 
              and providing customer support. We never share your data with third parties except 
              for payment processing through Razorpay.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
              Your Rights
            </h2>
            <p style={{ fontSize: '15px' }}>
              You have the right to access, correct, or delete your personal information at any time. 
              Contact us through our contact page for any privacy-related requests.
            </p>
          </section>
        </div>

        <div style={{
          marginTop: '40px',
          paddingTop: '30px',
          borderTop: '2px solid #f3f4f6',
          textAlign: 'center'
        }}>
          <Link 
            to="/" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 12px -2px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px -1px rgba(99, 102, 241, 0.3)';
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
