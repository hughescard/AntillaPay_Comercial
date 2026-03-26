'use client';

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { currency, type PaymentPreviewData } from "../create/types";

type InvoicePreviewProps = {
  previewData: PaymentPreviewData;
};

type InvoiceLine = {
  id: string;
  name: string;
  quantity: number;
  currency: string;
  unitValue: number;
  lineTotal: number;
};

const getCurrencySymbol = (value: string) =>
  currency.find((option) => option.value === value)?.sym ?? "";

const formatAmount = (value: number, currencyValue: string) => {
  const normalized = Number(value);
  const safeValue = Number.isFinite(normalized) ? normalized : 0;
  return `${getCurrencySymbol(currencyValue)}${safeValue.toFixed(2)}`;
};

export const InvoicePreview = ({ previewData }: InvoicePreviewProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";

  const issueDate = useMemo(() => new Date(), []);
  const dueDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date;
  }, []);

  const formatDate = (value: Date) =>
    new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(value);

  const invoiceLines = useMemo(() => {
    if (previewData.products.length > 0) {
      return previewData.products
        .map((product) => {
          const priceList = Array.isArray(product.prices) ? product.prices : [];
          const priceMatch =
            priceList.find(
              (price) => price.currency === previewData.currency
            ) ?? priceList[0];
          if (!priceMatch) return null;
          const unitValue = Number(priceMatch.value) / 100;
          if (!Number.isFinite(unitValue)) return null;
          return {
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            currency: priceMatch.currency,
            unitValue,
            lineTotal: unitValue * product.quantity,
          };
        })
        .filter(Boolean) as InvoiceLine[];
    }
    const amount = Number(previewData.amount);
    return [
      {
        id: "custom-amount",
        name: previewData.title || t("paymentLinkCreate.preview.titleValue"),
        quantity: 1,
        currency: previewData.currency,
        unitValue: Number.isFinite(amount) ? amount : 0,
        lineTotal: Number.isFinite(amount) ? amount : 0,
      },
    ];
  }, [previewData, t]);

  const subtotal = invoiceLines.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalLabel = formatAmount(subtotal, previewData.currency);

  return (
    <div className="mx-auto w-full max-w-155 rounded-2xl border border-border bg-surface px-6 py-6 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {t("paymentLinkCreate.preview.invoiceTitle")}
        </h3>
        <span className="text-xs text-muted-foreground">
          {t("paymentLinkCreate.preview.invoiceAccountPlaceholder")}
        </span>
      </div>

      <div className="mt-5 grid gap-6 text-xs text-muted-foreground md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-foreground">
              {t("paymentLinkCreate.preview.invoiceIssueDateLabel")}
            </span>
            <span>{formatDate(issueDate)}</span>
          </div>
          {/* <div className="flex items-center justify-between">
            <span className="text-[var(--foreground)]">
              {t("paymentLinkCreate.preview.invoiceDueDateLabel")}
            </span>
            <span>{formatDate(dueDate)}</span>
          </div> */}
        </div>
      </div>

      <div className="mt-6 text-sm font-semibold text-foreground">
        {t("paymentLinkCreate.preview.invoiceDueSummary", {
          amount: totalLabel,
        })}
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-[1fr_80px_120px_120px] gap-2 border-b border-border bg-surface-muted px-3 py-2 text-[10px] font-semibold text-muted-foreground">
          <span>{t("paymentLinkCreate.preview.invoiceItem")}</span>
          <span className="text-right">{t("paymentLinkCreate.preview.invoiceQty")}</span>
          <span className="text-right">
            {t("paymentLinkCreate.preview.invoiceUnitPrice")}
          </span>
          <span className="text-right">
            {t("paymentLinkCreate.preview.invoiceAmount")}
          </span>
        </div>
        <div className="divide-y divide-border">
          {invoiceLines.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_80px_120px_120px] gap-2 px-3 py-2 text-xs"
            >
              <span className="text-foreground">{item.name}</span>
              <span className="text-right text-muted-foreground">
                {item.quantity}
              </span>
              <span className="text-right text-muted-foreground">
                {formatAmount(item.unitValue, item.currency)}
              </span>
              <span className="text-right font-semibold text-foreground">
                {formatAmount(item.lineTotal, item.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>{t("paymentLinkCreate.preview.invoiceSubtotal")}</span>
          <span>{totalLabel}</span>
        </div>
        <div className="flex items-center justify-between text-foreground">
          <span className="font-semibold">
            {t("paymentLinkCreate.preview.invoiceOutstanding")}
          </span>
          <span className="font-semibold">{totalLabel}</span>
        </div>
      </div>
    </div>
  );
};
