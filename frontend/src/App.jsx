import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import './components/BuyCreditsButton.css';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to}
      style={{
        color: isActive ? '#6366f1' : '#4b5563',
        textDecoration: 'none',
        fontSize: '15px',
        fontWeight: isActive ? '600' : '500',
        padding: '10px 16px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        position: 'relative',
        background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))' : 'transparent'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.background = 'rgba(99, 102, 241, 0.05)';
          e.target.style.color = '#6366f1';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.target.style.background = 'transparent';
          e.target.style.color = '#4b5563';
        }
      }}
    >
      {children}
      {isActive && (
        <span style={{
          position: 'absolute',
          bottom: '4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)'
        }} />
      )}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        {/* Navigation Header */}
        <nav style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '18px 24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <Link 
              to="/" 
              style={{
                fontSize: '26px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span style={{ fontSize: '32px' }}>💳</span>
              <span>PaymentHub</span>
            </Link>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <NavLink to="/about">ℹ️ About</NavLink>
              <NavLink to="/contact">📧 Contact</NavLink>
              <NavLink to="/privacy">🔒 Privacy</NavLink>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>

        {/* Footer */}
        <footer style={{
          background: 'linear-gradient(135deg, #1f2937, #111827)',
          color: '#ffffff',
          padding: '50px 20px 30px',
          marginTop: '60px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '40px',
              marginBottom: '40px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  PaymentHub
                </h3>
                <p style={{ color: '#9ca3af', lineHeight: '1.8', fontSize: '14px' }}>
                  Secure and reliable payment processing powered by Razorpay. 
                  Making digital payments simple and accessible.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
                  Quick Links
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    Home
                  </Link>
                  <Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    About Us
                  </Link>
                  <Link to="/contact" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    Contact Us
                  </Link>
                  <Link to="/privacy" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
            <div style={{
              paddingTop: '30px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '15px', fontSize: '14px', color: '#9ca3af' }}>
                © {new Date().getFullYear()} PaymentHub. All rights reserved.
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                Secure payments powered by{' '}
                <span style={{ 
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '600'
                }}>
                  Razorpay
                </span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
