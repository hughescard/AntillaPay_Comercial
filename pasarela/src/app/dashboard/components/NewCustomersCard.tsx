import { Card } from "./Card";
import { MoneyValue } from "./MoneyValue";
import type { Money } from "../types";

type NewCustomersCardProps = {
  title: string;
  moreInfoLabel: string;
  total: number;
  deltaPct: number;
  recurringLabel: string;
  recurringValue: number;
  paymentsLabel: string;
  paymentsValue: number;
  avgVolumeLabel: string;
  avgVolume: Money;
  vsLabel: string;
};

export const NewCustomersCard = ({
  title,
  moreInfoLabel,
  total,
  deltaPct,
  recurringLabel,
  recurringValue,
  paymentsLabel,
  paymentsValue,
  avgVolumeLabel,
  avgVolume,
  vsLabel,
}: NewCustomersCardProps) => {
  const deltaColor =
    deltaPct >= 0 ? "text-emerald-500" : "text-rose-500";
  return (
    <Card title={title} actionLabel={moreInfoLabel}>
      <div className="text-2xl font-semibold text-[var(--foreground)]">
        {total}
      </div>
      {/* <div className={`mt-1 text-xs ${deltaColor}`}>
        {deltaPct > 0 ? "+" : ""}
        {deltaPct.toFixed(2)}% {vsLabel}
      </div> */}
      <div className="mt-6 space-y-3 text-xs text-[var(--muted-foreground)]">
        <div className="flex items-start justify-between gap-3">
          <span className="min-w-0 break-words">{recurringLabel}</span>
          <span className="text-[var(--foreground)]">{recurringValue}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="min-w-0 break-words">{paymentsLabel}</span>
          <span className="text-[var(--foreground)]">
            {paymentsValue.toFixed(1)}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="min-w-0 break-words">{avgVolumeLabel}</span>
          <span className="text-[var(--foreground)]">
            <MoneyValue value={avgVolume.value} currency={avgVolume.currency} />
          </span>
        </div>
      </div>
    </Card>
  );
};
