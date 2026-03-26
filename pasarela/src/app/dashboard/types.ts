export type Money = {
  value: number;
  currency: string;
};

export type ChartSeries = {
  points: number[];
  startLabel: string;
  endLabel: string;
};

export type DashboardFilters = {
  range: "last7Days" | "last30Days";
  granularity: "daily" | "weekly";
  compare: boolean;
  previousPeriod: boolean;
};

export type DashboardData = {
  netVolumeToday: Money;
  netVolumeYesterday: Money;
  netVolumeTimeLabel: string;
  chart: ChartSeries;
  balance: Money;
  transfers: number;
  recommendations: {
    items: Array<{
      text?: string;
      linkLabel?: string;
      href?: string;
      suffix?: string;
    }>;
  };
  apiKeys: {
    publishable: string;
    secret: string;
  };
  summary: {
    newCustomers: {
      total: number;
      deltaPct: number;
      recurring: number;
      paymentsPerCustomer: number;
      avgVolume: Money;
    };
    topCustomers: {
      total: Money;
      deltaPct: number;
      items: Array<{ name: string; value: Money }>;
    };
    topProducts: {
      total: Money;
      items: Array<{ name: string; value: Money; percent: number }>;
    };
  };
};
