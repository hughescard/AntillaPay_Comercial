import { Card } from "./Card";
import { MoneyValue } from "./MoneyValue";
import { ProgressBar } from "./ProgressBar";
import type { Money } from "../types";

type ProductItem = {
  name: string;
  value: Money;
  percent: number;
};

type TopProductsCardProps = {
  title: string;
  moreInfoLabel: string;
  periodLabel: string;
  total: Money;
  items: ProductItem[];
  tabs: {
    primary: string;
    secondary: string;
  };
};

export const TopProductsCard = ({
  title,
  moreInfoLabel,
  periodLabel,
  total,
  items,
  tabs,
}: TopProductsCardProps) => {
  return (
    <Card title={title} actionLabel={moreInfoLabel}>
      
      <div className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
        <MoneyValue value={total.value} currency={total.currency} />
      </div>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-start justify-between gap-3 text-xs text-[var(--foreground)]">
              <span className="min-w-0 break-words">{item.name}</span>
              <span className="font-semibold">
                <MoneyValue value={item.value.value} currency={item.value.currency} />
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[var(--muted-foreground)]">
              <ProgressBar value={item.percent * 100} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
