type ProgressBarProps = {
  value: number;
  color?: string;
};

export const ProgressBar = ({ value, color = "var(--accent)" }: ProgressBarProps) => {
  return (
    <div className="h-2 w-full rounded-full bg-[var(--surface-muted)]">
      <div
        className="h-2 rounded-full"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, backgroundColor: color }}
      />
    </div>
  );
};
