import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { Spinner } from "@/components/ui/spinner";
import type { ApiError } from "@/types/apiError";
import type { User } from "@/types/user";
import authService from "@/api/services/authService";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (username: string, password: string) => {
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
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    // window.location.reload();
  };

  useEffect(() => {
    async function checkAuthenticated() {
      setLoading(true);
      try {
        const response = await authService.getLoggedInUser();
        setUser(response.data);
      } catch (err) {
        setUser(null);
        return { error: err as ApiError };
      } finally {
        setLoading(false);
      }
    }

    checkAuthenticated();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
