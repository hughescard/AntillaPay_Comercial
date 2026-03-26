import { MoneyValue } from "./MoneyValue";
import type { Money } from "../types";

type InlineStatProps = {
  label: string;
  value: Money | string;
  actionLabel?: string;
};

const InlineStat = ({ label, value, actionLabel }: InlineStatProps) => (
  <div className="flex flex-col gap-3 border-t border-[var(--border)] py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
      <div className="mt-1 text-lg font-semibold text-[var(--foreground)]">
        {typeof value === "string" ? value : (
          <MoneyValue value={value.value} currency={value.currency} />
        )}
      </div>
    </div>
    <button
      type="button"
      className="text-xs font-semibold text-[var(--accent)]"
    >
      {actionLabel}
    </button>
  </div>
);

type InlineStatsProps = {
  balanceLabel: string;
  transferLabel: string;
  actionLabel: string;
  balance: Money;
  transfers: number;
};

export const InlineStats = ({
  balanceLabel,
  transferLabel,
  actionLabel,
  balance,
  transfers,
}: InlineStatsProps) => {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch sm:gap-6">
      <InlineStat
        label={balanceLabel}
        value={balance}
      />
      <InlineStat
        label={transferLabel}
        value={transfers === 0 ? "—" : transfers.toString()}
      />
    </div>
  );
};
