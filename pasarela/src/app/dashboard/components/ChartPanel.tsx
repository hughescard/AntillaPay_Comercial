import { AreaChart } from "./AreaChart";
import type { ChartSeries, Money } from "../types";
import { MoneyValue } from "./MoneyValue";

type MetricProps = {
  label: string;
  value: Money;
  timeLabel?: string;
};

const Metric = ({ label, value, timeLabel }: MetricProps) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{label}</span>
    </div>
    <div className="lg:text-lg xs:text-2xl font-semibold text-foreground">
      <MoneyValue value={value.value} currency={value.currency} />
    </div>
    {timeLabel ? (
      <div className="text-xs text-muted-foreground">{timeLabel}</div>
    ) : null}
  </div>
);

type ChartPanelProps = {
  netVolumeLabel: string;
  yesterdayLabel: string;
  netVolume: Money;
  yesterday: Money;
  chart: ChartSeries;
};

export const ChartPanel = ({
  netVolumeLabel,
  yesterdayLabel,
  netVolume,
  yesterday,
  chart,
}: ChartPanelProps) => {
  return (
    <div className="rounded-2xl py-5 w-full">
      <div className="flex flex-wrap gap-6 lg:flex-row flex-col lg:justify-between">
        <Metric label={netVolumeLabel} value={netVolume} />
        <Metric label={yesterdayLabel} value={yesterday} />
      </div>
      <div className="mt-6">
        <AreaChart
          points={chart.points}
          startLabel={chart.startLabel}
          endLabel={chart.endLabel}
        />
      </div>
    </div>
  );
};
