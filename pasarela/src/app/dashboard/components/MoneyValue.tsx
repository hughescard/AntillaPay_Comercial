'use client';

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type MoneyValueProps = {
  value: number;
  currency: string;
  className?: string;
};

export const MoneyValue = ({ value, currency, className }: MoneyValueProps) => {
  const { i18n } = useTranslation();
  const formatted = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(value),
    [currency, i18n.language, value]
  );

  return <span className={className}>{formatted}</span>;
};
