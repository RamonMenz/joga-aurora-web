import { useContext } from "react";
import { ThemeProviderContext, type ThemeProviderState } from "./ThemeContext";

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }
  return context;
};
