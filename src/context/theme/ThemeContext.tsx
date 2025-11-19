import { createContext } from "react";
import type { Theme } from "./theme";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Context criado como undefined para detectar uso fora do provider
export const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);
