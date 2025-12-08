import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Button } from '../ui/button';
import { Cookie } from 'lucide-react';

export function CookieConsentBanner() {
  const { hasConsent, isLoading, grantConsent } = useCookieConsent();

  // Não renderiza nada enquanto carrega ou se já tem consentimento
  if (isLoading || hasConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Cookie className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Cookies necessários para autenticação</p>
              <p className="text-sm text-muted-foreground mt-1">
                Usamos cookies essenciais para manter você conectado de forma segura. 
                Ao aceitar, você permite o funcionamento completo da plataforma.
              </p>
            </div>
          </div>
          <div className="flex gap-2 sm:shrink-0">
            <Button
              onClick={grantConsent}
              size="sm"
              className="whitespace-nowrap"
            >
              Aceitar cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
