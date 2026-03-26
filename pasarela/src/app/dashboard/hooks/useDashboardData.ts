import { useCallback, useEffect, useMemo, useState } from "react";
import API from "@/lib/api";
import type { DashboardData, DashboardFilters } from "../types";
import { t } from "i18next";
import { USD } from "@/app/paymentLink/create/types";

const extractKeyValue = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const key = (value as { key?: unknown }).key ?? (value as { token?: unknown }).token;
    if (typeof key === "string") return key;
  }
  return "";
};

const getEmptyDashboardData = (): DashboardData => ({
  netVolumeToday: { value: 0, currency: "USD" },
  netVolumeYesterday: { value: 0, currency: "USD" },
  netVolumeTimeLabel: "",
  chart: {
    points: [],
    startLabel: "",
    endLabel: "",
  },
  balance: { value: 0, currency: "USD" },
  transfers: 0,
  recommendations: {
    items: [
      {
        text: t("dashboard.recommendations.item1Prefix"),
        linkLabel: t("dashboard.recommendations.item1Link"),
        href: "/paymentLink/create",
        suffix: t("dashboard.recommendations.item1Suffix"),
      },
      {
        text: t("dashboard.recommendations.item2"),
      },
    ],
  },
  apiKeys: {
    publishable: "",
    secret: "",
  },
  summary: {
    newCustomers: {
      total: 0,
      deltaPct: 0,
      recurring: 0,
      paymentsPerCustomer: 0,
      avgVolume: { value: 0, currency: "USD" },
    },
    topCustomers: {
      total: { value: 0, currency: "USD" },
      deltaPct: 0,
      items: [],
    },
    topProducts: {
      total: { value: 0, currency: "USD" },
      items: [],
    },
  },
});


export const useDashboardData = (filters: DashboardFilters) => {
  const [data, setData] = useState<DashboardData>(getEmptyDashboardData());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const params = useMemo(
    () => ({
      range: filters.range,
      granularity: filters.granularity,
      compare: filters.compare,
      previousPeriod: filters.previousPeriod,
    }),
    [filters]
  );

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(false);

    try {
      const newCustomers = await API.get("/stats/customers?days=7", {
        params,
      });

      const keys = await API.get(`/businesses/keys`,);

      const topCustomers = await API.get("/stats/top-customers?days=7&limit=3", {
        params,
      });

      const topProducts = await API.get("/stats/top-products?days=7&limit=3", {
        params,
      });

      const series = await API.get("/stats/netbalance-series", {
        params,
      });

      const balance = await API.get("/stats/balance", {
        params,
      });

      await API.get("/auth/me", {
        params,
      });

      const op = await API.get("/stats/completed-ops", {
        params,
      });
      const compareDelta = filters.compare ? (filters.range === "last30Days" ? 18 : 9) : 0;

      setData(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          netVolumeYesterday: {
            value: filters.previousPeriod && filters.compare ? balance.data.netBalance : 0,
            currency: USD,
          },
          netVolumeToday: { value: balance.data.grossBalance, currency: USD },
          balance: { value: balance.data.grossBalance, currency: USD },
          chart: {
            points: series.data.data.map((item:{"netBalance": number}) => item.netBalance),
            startLabel: series.data.from.split("T")[0],
            endLabel: series.data.to.split("T")[0],
          },
          apiKeys: {
            publishable: extractKeyValue(keys.data.publicKey.key),
            secret: extractKeyValue(keys.data.privateKey.key),
          },
          transfers: op.data.total,
          summary: {
            newCustomers: {
              total: newCustomers.data["newCustomers"],
              deltaPct: compareDelta,
              recurring: newCustomers.data["recurrentCustomers"],
              paymentsPerCustomer: newCustomers.data["payins"]["paymentsPerCustomer"],
              avgVolume: { value: Number(newCustomers.data["payins"]["averageVolume"])/100, currency: newCustomers.data["payins"]["currency"] },
            },
            topCustomers: {
              total: { value: topCustomers.data.data.reduce(
                (acc: number, item: { totalAmount: number }) =>
                  acc + item.totalAmount / 100,
                0
              ), currency: topCustomers.data["currency"] },
              deltaPct: compareDelta > 0 ? Math.max(compareDelta - 3, 1) : 0,
              items: topCustomers.data["data"].map((item:
                {
                  "customerName": string;
                  "customerBusinessName": string;
                  "totalAmount": number,
                }) => ({name: item["customerBusinessName"] || item["customerName"], value: { value: Number(item["totalAmount"])/100, currency: topCustomers.data["currency"] }}))
              ,
            },
            topProducts: {
              total: { value: topProducts.data["data"].reduce(
                (acc: number, item: { totalQuantity: number, "product": { "prices": {"currency": string, value:number}[]} }) =>
                  acc + (item.totalQuantity * item.product.prices[0].value / 100),
                0
              ), currency: USD },
              items: topProducts.data["data"].map((item:
                {
                  "name": string;
                  "product": { "prices": {"currency": string, value:string}[]}
                }) => ({name: item["name"], value: { value: Number(item.product.prices[0].value)/100, currency: item.product["prices"][0]["currency"]}}))
              ,
            },
          },
        };
      });


      // setData(normalizeDashboardResponse(response.data));
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { data, isLoading, error, refetch: fetchDashboardData };
};
