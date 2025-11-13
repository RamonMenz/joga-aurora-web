import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HomeCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  className?: string;
}

export const HomeCard: React.FC<HomeCardProps> = ({
  to,
  icon,
  title,
  onClick,
  className,
}) => {
  const cardContent = (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-lg hover:shadow-lg transition-shadow h-40 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        className
      )}
    >
      {icon}
      <span className="mt-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </span>
    </div>
  );

  if (onClick) {
    return (
      <a onClick={onClick} className="cursor-pointer">
        {cardContent}
      </a>
    );
  }

  return <Link to={to}>{cardContent}</Link>;
};
