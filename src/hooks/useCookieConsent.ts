import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'joga-aurora-cookie-consent';

export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verifica se o usuário já deu consentimento anteriormente
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    setHasConsent(consent === 'true');
    setIsLoading(false);
  }, []);

  const grantConsent = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setHasConsent(true);
  };

  const revokeConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setHasConsent(false);
  };

  return {
    hasConsent,
    isLoading,
    grantConsent,
    revokeConsent,
  };
}
