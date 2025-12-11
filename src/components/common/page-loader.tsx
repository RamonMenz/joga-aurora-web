import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function PageLoader({ 
  message = "Carregando...", 
  className,
  fullScreen = true 
}: PageLoaderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullScreen ? "h-full" : "h-64",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Spinner className="h-8 w-8" />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
