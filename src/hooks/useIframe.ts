
import { useState, useEffect } from 'react';

export const useIframe = () => {
  const [isInIframe, setIsInIframe] = useState(false);
  const [isAllowedIframe, setIsAllowedIframe] = useState(false);

  useEffect(() => {
    // Check if the app is running inside an iframe and from allowed origin
    const checkIframe = () => {
      try {
        const inIframe = window.self !== window.top;
        if (inIframe) {
          // Check if parent origin is skilljourney.in
          try {
            const parentOrigin = document.referrer;
            const allowedOrigin = 'skilljourney.in';
            const isAllowed = parentOrigin.includes(allowedOrigin);
            setIsAllowedIframe(isAllowed);
            
            if (!isAllowed) {
              // Block iframe from unauthorized domains
              console.warn('Iframe access blocked - unauthorized origin');
              window.top?.location.replace('https://skilljourney.in');
            }
            
            return isAllowed;
          } catch (e) {
            // If we can't check referrer, block for security
            console.warn('Iframe access blocked - unable to verify origin');
            return false;
          }
        }
        return false;
      } catch (e) {
        // If we can't access window.top due to cross-origin restrictions,
        // we're likely in an iframe - check referrer
        try {
          const parentOrigin = document.referrer;
          const allowedOrigin = 'skilljourney.in';
          const isAllowed = parentOrigin.includes(allowedOrigin);
          setIsAllowedIframe(isAllowed);
          return isAllowed;
        } catch (referrerError) {
          return false;
        }
      }
    };

    const result = checkIframe();
    setIsInIframe(result);
  }, []);

  return { isInIframe: isInIframe && isAllowedIframe, isAllowedIframe };
};
