import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import {currency as currencies, currencyType} from "../../types"

type CurrencyAmountSectionProps = {
  currency: string;
  amount: number;
  onCurrencyChange: (value: currencyType) => void;
  onAmountChange: (value: number) => void;
  amountError: boolean;
};

export const CurrencyAmountSection = ({
  currency,
  amount,
  onCurrencyChange,
  onAmountChange,
  amountError,
}: CurrencyAmountSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-semibold text-[var(--foreground)]">
          {t("paymentLinkCreate.paymentSettings.currencyLabel")}
        </div>
        <div className="relative">
          <select
            value={currency}
            onChange={(event) => onCurrencyChange(event.target.value as unknown as currencyType)}
            className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 pr-10 text-sm text-[var(--foreground)]"
          >
            {currencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold text-[var(--foreground)]">
          {t("paymentLinkCreate.paymentSettings.amountLabel")}
          <span className="ml-1 text-danger">*</span>
        </div>
        <input
          type="number"
          min={0}
          step="0.01"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value as unknown as number)}
          placeholder="0.00"
          className={`w-full rounded-lg border bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] ${
            amountError ? "border-danger" : "border-[var(--border)]"
          }`}
        />
        {amountError && (
          <p className="text-sm text-danger" role="alert">
            {t("paymentLinkCreate.paymentSettings.amountGreaterThanZeroError")}
          </p>
        )}
      </div>
    </div>
  );
};
