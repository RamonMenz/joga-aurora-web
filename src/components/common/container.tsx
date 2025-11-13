// src/components/Container.tsx
import React from "react";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  const baseClasses = "flex flex-col h-full w-full max-w-5xl items-center justify-start";

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};
