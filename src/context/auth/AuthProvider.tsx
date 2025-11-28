import { useEffect, useState, useCallback, useMemo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { PageLoader } from "@/components/common/page-loader";
import type { ApiError } from "@/types/apiError";
import type { User } from "@/types/user";
import authService from "@/api/services/authService";
import { ROUTES } from "@/util/constants";
import systemService from "@/api/services/systemService";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [booting, setBooting] = useState<boolean>(true);

  const navigate = useNavigate();

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(username, password);
      setUser(response.data);
    } catch (err) {
      setUser(null);
      return { error: err as ApiError };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Erro ao realizar logout:", err);
      }
    } finally {
      setUser(null);
      navigate(ROUTES.LOGIN);
    }
  }, [navigate]);

  useEffect(() => {
    let cancelled = false;
    async function bootAndAuth() {
      try {
        setBooting(true);
        // Aguarda backend responder (ou até estourar tentativas)
        await systemService.waitUntilHealthy({ retries: 6, delayMs: 1000 });
      } catch {
        // ignora: segue fluxo mesmo sem health ok
      } finally {
        if (!cancelled) {
          setBooting(false);
        }
      }

      if (cancelled) return;
      setLoading(true);
      try {
        const response = await authService.getLoggedInUser();
        setUser(response.data);
      } catch (err) {
        setUser(null);
        if (import.meta.env.DEV) {
          console.error("Erro ao verificar autenticação:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void bootAndAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  // Ouve eventos globais disparados pelo interceptor para 401
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      navigate(ROUTES.LOGIN);
    };
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, [navigate]);

  const value = useMemo(() => ({
    user,
    setUser,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user, login, logout]);

  if (booting) {
    return <PageLoader className="h-screen" message="Iniciando sistema..." />;
  }

  if (loading) {
    return <PageLoader className="h-screen" message="Verificando autenticação..." />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
