import { memo } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HomeCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  className?: string;
}

export const HomeCard = memo<HomeCardProps>(function HomeCard({
  to,
  icon,
  title,
  onClick,
  className,
}) {
  const cardContent = (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-lg aspect-square hover:shadow-lg transition-shadow h-40 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        className
      )}
    >
      {icon}
      <span className="mt-2 text-lg font-semibold">{title}</span>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="cursor-pointer" type="button">
        {cardContent}
      </button>
    );
  }

  return <Link to={to}>{cardContent}</Link>;
});
