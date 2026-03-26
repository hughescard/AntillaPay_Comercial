import { useState } from "react";
import type { DashboardFilters } from "../types";

const defaultFilters: DashboardFilters = {
  range: "last7Days",
  granularity: "daily",
  compare: true,
  previousPeriod: true,
};

export const useDashboardFilters = () => {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  return { filters, setFilters };
};
