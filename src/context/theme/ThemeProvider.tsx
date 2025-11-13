import { useEffect, useState } from "react";
import { ThemeProviderContext, type ThemeProviderProps } from "./ThemeContext";
import type { Theme } from "./theme";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // Apply current theme and sync with system if needed
  useEffect(() => {
    const root = window.document.documentElement;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      root.classList.remove("light", "dark");
      if (theme === "system") {
        root.classList.add(mql.matches ? "dark" : "light");
      } else {
        root.classList.add(theme);
      }
    };

    apply();

    if (theme === "system") {
      const onChange = () => apply();
      // Listen to OS theme changes while on 'system'
      mql.addEventListener?.("change", onChange);
      return () => mql.removeEventListener?.("change", onChange);
    }
  }, [theme]);

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{
        theme,
        setTheme: (theme: Theme) => {
          localStorage.setItem(storageKey, theme);
          setTheme(theme);
        },
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}
