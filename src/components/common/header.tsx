import { useNavigate } from "react-router-dom";
import { Home, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/auth/useAuth";
import { ModeToggle } from "./mode-toggle";
import { Button } from "../ui/button";

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    // <header className="w-full top-0 z-40 bg-background shadow-sm border-b">
    <header className="fixed top-0 w-full z-40 bg-background shadow-sm border-b">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        {/* Esquerda (vazia para manter título centralizado) */}
        <div className="w-1/3 flex justify-start items-center gap-3">
          {isAuthenticated && (
            <Button
              variant="outline"
              size="icon"
              onClick={logout}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
          <ModeToggle />
        </div>

        {/* Centro */}
        <h1 className="w-1/3 text-center text-xl font-semibold select-none">
          Joga Aurora
        </h1>

        {/* Direita */}
        <div className="w-1/3 flex justify-end items-center gap-3">
          {isAuthenticated && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/")}
                className="flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Home className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
