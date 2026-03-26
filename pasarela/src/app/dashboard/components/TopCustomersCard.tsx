import { Card } from "./Card";
import { MoneyValue } from "./MoneyValue";
import { ProgressBar } from "./ProgressBar";
import type { Money } from "../types";

type CustomerItem = {
  name: string;
  value: Money;
};

type TopCustomersCardProps = {
  title: string;
  moreInfoLabel: string;
  total: Money;
  deltaPct: number;
  vsLabel: string;
  items: CustomerItem[];
};

export const TopCustomersCard = ({
  title,
  moreInfoLabel,
  total,
  deltaPct,
  vsLabel,
  items,
}: TopCustomersCardProps) => {
  const maxValue = Math.max(...items.map((item) => item.value.value), 1);
  const deltaColor =
    deltaPct >= 0 ? "text-emerald-500" : "text-rose-500";

  return (
    <Card title={title} actionLabel={moreInfoLabel}>
      <div className="text-2xl font-semibold text-[var(--foreground)]">
        <MoneyValue value={total.value} currency={total.currency} />
      </div>
      {/* <div className={`mt-1 text-xs ${deltaColor}`}>
        {deltaPct > 0 ? "+" : ""}
        {deltaPct.toFixed(1)}% {vsLabel}
      </div> */}
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-start justify-between gap-3 text-xs text-[var(--foreground)]">
              <span className="min-w-0 break-words">{item.name}</span>
              <span className="font-semibold">
                <MoneyValue value={item.value.value} currency={item.value.currency} />
              </span>
            </div>
            <ProgressBar value={(item.value.value / maxValue) * 100} />
          </div>
        ))}
      </div>
    </Card>
  );
};
