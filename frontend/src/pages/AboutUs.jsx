import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
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
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          About Us
        </h1>

        <div style={{ lineHeight: '1.8', color: '#4b5563' }}>
          <p style={{ marginBottom: '20px', fontSize: '16px' }}>
            We are a trusted platform providing secure payment and credit management services. 
            Our mission is to make digital payments simple, secure, and accessible to everyone.
          </p>
          <p style={{ fontSize: '16px' }}>
            We leverage industry-leading payment gateways like Razorpay to ensure your transactions 
            are processed safely and efficiently. All payments are PCI DSS compliant and encrypted 
            for maximum security.
          </p>
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

export default AboutUs;
