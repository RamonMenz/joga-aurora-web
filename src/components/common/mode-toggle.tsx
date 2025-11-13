import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme/useTheme";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const changeTheme = () => {
    const isDark = theme !== "light";
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button variant="outline" size="icon" onClick={() => changeTheme()}>
      {theme === "light" ? (
        <Sun className="absolute h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
      ) : (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
