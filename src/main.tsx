import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/theme/ThemeProvider.tsx";
import { ErrorBoundary } from "./components/common/error-boundary.tsx";
import { App } from "./App.tsx";
import { Toaster } from "sonner";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <App />
      <Toaster />
    </ThemeProvider>
  </ErrorBoundary>
);
