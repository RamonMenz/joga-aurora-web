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

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});
