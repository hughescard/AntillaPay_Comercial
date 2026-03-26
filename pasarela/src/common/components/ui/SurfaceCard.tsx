import { ReactNode } from "react";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export const SurfaceCard = ({ children, className = "" }: SurfaceCardProps) => {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm ${className}`.trim()}
    >
      {children}
    </div>
  );
};
