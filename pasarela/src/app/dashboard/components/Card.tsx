import { ReactNode } from "react";

type CardProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
};

export const Card = ({ title, actionLabel, onAction, children }: CardProps) => {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {title}
        </p>
        {/* {actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            className="text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            {actionLabel}
          </button>
        ) : null} */}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
};
