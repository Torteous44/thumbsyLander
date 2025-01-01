import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Hero.css';
import thumbsy from './images/thumbsy.png';
import river from './images/river.png';

const Hero = () => {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <div
      className="hero-container"
      style={{
        backgroundImage: `url(${river})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="content-wrapper">
        <div className="info-card">
          <AnimatePresence mode="wait">
            {showLanding ? (
              <LandingContent
                key="landing" 
                onTryItNow={() => setShowLanding(false)}
              />
            ) : (
              <SecondContent
                key="second"
                onGoBack={() => setShowLanding(true)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* Landing Content (first state) */
const LandingContent = ({ onTryItNow }) => {
  return (
    <motion.div
      /* 
        initial: starting style
        animate: target style
        exit: style when leaving 
      */
      initial={{ 
        opacity: 0, 
        height: 0,
        y: 20
      }}
      animate={{ 
        opacity: 1, 
        height: 'auto',
        y: 0
      }}
      exit={{ 
        opacity: 0, 
        height: 0,
        y: -20
      }}
      /* 
        transition controls speed, easing, etc.
        'height: auto' transitions require Framer Motion's layout or these "smart" props
      */
      transition={{ 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1], // Smooth easing curve
        opacity: { duration: 0.25 }, // Faster opacity transition
        height: { 
          duration: 0.4,
          ease: [0.04, 0.62, 0.23, 0.98] // Custom spring-like easing
        }
      }}
      style={{ overflow: 'hidden' }}
    >
      <img className="thumb-icon" src={thumbsy} alt="Thumb icon" />

      <h2>Knowing what you’re buying</h2>
      <p className="subtitle">should be as simple as possible.</p>
      
      <hr />

      <p className="description">
        Thumbsy is an app which helps you get the reviews you want 
        instantly in person. Just scan a barcode and access thousands 
        of customer insights online.
      </p>

      <p className="description">
        We are continuously updating the app and would love 
        to take you along for the ride. Want to join us in our 
        beta testing? Click the link below.
      </p>

      <button className="cta-button" onClick={onTryItNow}>
        Try it <em>now</em>
      </button>
    </motion.div>
  );
};

/* Second Content (after user clicks "Try it now") */
const SecondContent = ({ onGoBack }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('https://thumbsywaitlist.onrender.com/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // First check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error: Invalid response format');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join waitlist');
      }

      setStatus('success');
      setEmail('');
      
    } catch (error) {
      console.error('Waitlist submission error:', error);
      setStatus('error');
      setErrorMessage(
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: 20 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: -20 }}
      transition={{ 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        opacity: { duration: 0.25 },
        height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }
      }}
      style={{ overflow: 'hidden' }}
    >
      <button className="back-button" onClick={onGoBack}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <h2>Join Our Waitlist!</h2>
      <p className="description">
        We're putting the finishing touches on Thumbsy and getting ready 
        for launch. Be among the first to experience instant product reviews 
        right where you shop.
      </p>

      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="success-message"
        >
          <h3>🎉 You're on the list!</h3>
          <p>Thanks for joining. We'll keep you updated on our progress.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="waitlist-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className={`email-input ${status === 'error' ? 'error' : ''}`}
            disabled={status === 'loading'}
          />
          <button 
            type="submit" 
            className={`cta-button primary ${status === 'loading' ? 'loading' : ''}`}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <span>Joining...</span>
            ) : (
              <span>Join Waitlist</span>
            )}
          </button>
        </form>
      )}

      {status === 'error' && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="error-message"
        >
          {errorMessage}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Hero;
