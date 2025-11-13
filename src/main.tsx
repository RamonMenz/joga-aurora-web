import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/theme/ThemeProvider.tsx";
import { App } from "./App.tsx";
import { Toaster } from "sonner";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <App />
    <Toaster />
  </ThemeProvider>
);
