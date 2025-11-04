import { useRef, useEffect, useState } from 'react';

/**
 * Custom hook to safely handle scroll progress with proper ref hydration
 * Prevents "Target ref is defined but not hydrated" errors
 */
export const useScrollProgress = () => {
  const ref = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Wait for ref to be properly hydrated
  useEffect(() => {
    const checkRef = () => {
      if (ref.current) {
        setIsReady(true);
      }
    };

    // Check immediately
    checkRef();
    
    // Also check after delays to ensure DOM is ready
    const timer1 = setTimeout(checkRef, 100);
    const timer2 = setTimeout(checkRef, 300);
    const timer3 = setTimeout(checkRef, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return {
    ref,
    isReady
  };
};
