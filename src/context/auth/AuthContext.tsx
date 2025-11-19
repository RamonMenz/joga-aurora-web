import type { ApiError } from "@/types/apiError";
import type { User } from "@/types/user";
import { createContext } from "react";

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<void | { error: ApiError }>;
  logout: () => Promise<void>;
}

// Context inicial como undefined para detectar uso fora do provider
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
