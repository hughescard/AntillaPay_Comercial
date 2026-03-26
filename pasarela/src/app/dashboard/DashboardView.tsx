'use client';

import { useTranslation } from "react-i18next";
import { useDashboardData } from "./hooks/useDashboardData";
import { useDashboardFilters } from "./hooks/useDashboardFilters";

import { ChartPanel } from "./components/ChartPanel";
import { RecommendationsCard } from "./components/RecommendationsCard";
import { InlineStats } from "./components/InlineStats";
import { FiltersBar } from "./components/FiltersBar";
import { NewCustomersCard } from "./components/NewCustomersCard";
import { TopCustomersCard } from "./components/TopCustomersCard";
import { TopProductsCard } from "./components/TopProductsCard";

export const DashboardView = () => {
  const { t } = useTranslation();
  const { filters, setFilters } = useDashboardFilters();
  const { data, isLoading, error } = useDashboardData(filters);

  const recommendations = data.recommendations.items

  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 sm:py-8 animate-enter-step">

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {t("dashboard.todayTitle")}
          </h2>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
              <ChartPanel
                netVolumeLabel={t("dashboard.netVolume")}
                yesterdayLabel={t("dashboard.yesterday")}
                netVolume={data.netVolumeToday}
                yesterday={data.netVolumeYesterday}
                chart={data.chart}
              />
              <InlineStats
                balanceLabel={t("dashboard.balanceLabel")}
                transferLabel={t("dashboard.transfersLabel")}
                actionLabel={t("dashboard.viewData")}
                balance={data.balance}
                transfers={data.transfers}
              />
            </div>

            <RecommendationsCard
              title={t("dashboard.recommendations.title")}
              items={recommendations}
              apiKeysTitle={t("dashboard.apiKeys.title")}
              docLinkLabel={t("dashboard.apiKeys.docLink")}
              docLinkHref="/dashboard/developers/docs"
              publishableLabel={t("dashboard.apiKeys.publishable")}
              secretLabel={t("dashboard.apiKeys.secret")}
              apiKeys={data.apiKeys}
            />
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {t("dashboard.summary.title")}
            </h3>
          </div>
          <FiltersBar
            filters={filters}
            onChange={setFilters}
            labels={{
              range: t("dashboard.filters.range"),
              last7Days: t("dashboard.filters.last7Days"),
              last30Days: t("dashboard.filters.last30Days"),
              daily: t("dashboard.filters.daily"),
              weekly: t("dashboard.filters.weekly"),
              compare: t("dashboard.filters.compare"),
              previousPeriod: t("dashboard.filters.previousPeriod"),
            }}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <NewCustomersCard
              title={t("dashboard.cards.newCustomers.title")}
              moreInfoLabel={t("dashboard.cards.moreInfo")}
              total={data.summary.newCustomers.total}
              deltaPct={data.summary.newCustomers.deltaPct}
              recurringLabel={t("dashboard.cards.newCustomers.recurring")}
              recurringValue={data.summary.newCustomers.recurring}
              paymentsLabel={t("dashboard.cards.newCustomers.paymentsPerCustomer")}
              paymentsValue={data.summary.newCustomers.paymentsPerCustomer}
              avgVolumeLabel={t("dashboard.cards.newCustomers.avgVolume")}
              avgVolume={data.summary.newCustomers.avgVolume}
              vsLabel={t("dashboard.cards.vsYesterday")}
            />

            <TopCustomersCard
              title={t("dashboard.cards.topCustomers.title")}
              moreInfoLabel={t("dashboard.cards.moreInfo")}
              total={data.summary.topCustomers.total}
              deltaPct={data.summary.topCustomers.deltaPct}
              vsLabel={t("dashboard.cards.vsYesterday")}
              items={data.summary.topCustomers.items}
            />

            <TopProductsCard
              title={t("dashboard.cards.topProducts.title")}
              moreInfoLabel={t("dashboard.cards.moreInfo")}
              periodLabel={t("dashboard.cards.topProducts.periodLabel")}
              total={data.summary.topProducts.total}
              items={data.summary.topProducts.items}
              tabs={{
                primary: t("dashboard.cards.topProducts.always"),
                secondary: t("dashboard.cards.topProducts.last30Days"),
              }}
            />
          </div>
        </section>

        {/* {isLoading ? (
          <p className="text-xs text-[var(--muted-foreground)]">
            {t("dashboard.loading")}
          </p>
        ) : null}
        {error ? (
          <p className="text-xs text-[var(--danger)]">
            {t("dashboard.error")}
          </p>
        ) : null} */}
      </div>
    </main>
  );
};
