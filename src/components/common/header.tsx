import { useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Home, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/auth/useAuth";
import { ModeToggle } from "./mode-toggle";
import { Button } from "../ui/button";
import { APP_CONFIG, ROUTES } from "@/util/constants";

export const Header = memo(function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleGoHome = useCallback(() => {
    navigate(ROUTES.HOME);
  }, [navigate]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <header className="fixed top-0 w-full z-40 bg-background shadow-sm border-b">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <div className="w-1/3 flex justify-start items-center gap-3">
          {isAuthenticated && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm"
              aria-label="Sair do sistema"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
          <ModeToggle />
        </div>

        <h1 className="w-1/3 text-center text-xl font-semibold select-none">
          {APP_CONFIG.NAME}
        </h1>

        <div className="w-1/3 flex justify-end items-center gap-3">
          {isAuthenticated && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handleGoHome}
                className="flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm"
                aria-label="Ir para página inicial"
              >
                <Home className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleGoBack}
                className="flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm"
                aria-label="Voltar para página anterior"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
});
