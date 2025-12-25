import { useState, useEffect } from 'react';

// Global state to track script loading across all component instances
let razorpayScriptPromise = null;
let razorpayScriptLoaded = false;
let razorpayScriptError = null;

/**
 * Custom hook to load Razorpay checkout script
 * Ensures script loads only once across all component instances
 * Handles script load failures gracefully
 * 
 * @returns {Object} { isLoaded, isLoading, error }
 */
const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(razorpayScriptLoaded);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(razorpayScriptError);

  useEffect(() => {
    // If script is already loaded, return early
    if (razorpayScriptLoaded || window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    // If script is already loading, wait for existing promise
    if (razorpayScriptPromise) {
      setIsLoading(true);
      razorpayScriptPromise
        .then(() => {
          setIsLoaded(true);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
      return;
    }

    // Check if script tag already exists in DOM
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      // Script tag exists, create promise to wait for it
      setIsLoading(true);
      
      // Create a promise for existing script if one doesn't exist
      if (!razorpayScriptPromise) {
        razorpayScriptPromise = new Promise((resolve, reject) => {
          // Check if already loaded
          if (window.Razorpay) {
            razorpayScriptLoaded = true;
            resolve();
            return;
          }

          let checkCount = 0;
          const maxChecks = 50; // Max 5 seconds (50 * 100ms)
          
          const checkRazorpay = () => {
            if (window.Razorpay) {
              razorpayScriptLoaded = true;
              resolve();
            } else if (checkCount < maxChecks) {
              checkCount++;
              setTimeout(checkRazorpay, 100);
            } else {
              // Timeout - script might have failed
              const timeoutError = new Error('Razorpay script loading timeout');
              razorpayScriptError = timeoutError;
              reject(timeoutError);
            }
          };

          // Wait for load event
          existingScript.addEventListener('load', () => {
            if (window.Razorpay) {
              razorpayScriptLoaded = true;
              resolve();
            } else {
              const loadError = new Error('Razorpay script loaded but Razorpay object not found');
              razorpayScriptError = loadError;
              reject(loadError);
            }
          });

          existingScript.addEventListener('error', () => {
            const error = new Error('Failed to load Razorpay script');
            razorpayScriptError = error;
            reject(error);
          });

          // Start checking
          checkRazorpay();
        });
      }

      // Wait for the promise
      razorpayScriptPromise
        .then(() => {
          setIsLoaded(true);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
      
      return;
    }

    // Create new script and load it
    setIsLoading(true);
    
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.crossOrigin = 'anonymous';

      // Handle successful load
      script.onload = () => {
        if (window.Razorpay) {
          razorpayScriptLoaded = true;
          razorpayScriptError = null;
          setIsLoaded(true);
          setIsLoading(false);
          resolve();
        } else {
          const loadError = new Error('Razorpay script loaded but Razorpay object not found');
          razorpayScriptError = loadError;
          setError(loadError);
          setIsLoading(false);
          reject(loadError);
        }
      };

      // Handle load failure
      script.onerror = (err) => {
        const loadError = new Error('Failed to load Razorpay checkout script. Please check your internet connection.');
        razorpayScriptError = loadError;
        setError(loadError);
        setIsLoading(false);
        razorpayScriptPromise = null; // Reset promise so retry is possible
        reject(loadError);
      };

      // Add script to document
      document.body.appendChild(script);
    });

    // Handle promise result
    razorpayScriptPromise
      .then(() => {
        // Already handled in onload
      })
      .catch((err) => {
        // Already handled in onerror
      });
  }, []);

  return { isLoaded, isLoading, error };
};

export default useRazorpay;

