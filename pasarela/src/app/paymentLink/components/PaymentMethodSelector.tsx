import { Landmark } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PaymentMethod } from "./paymentPreview.types";

type PaymentMethodSelectorProps = {
  transferEnabled: boolean;
  balanceEnabled: boolean;
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
};

export const PaymentMethodSelector = ({
  transferEnabled,
  balanceEnabled,
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <p className="text-sm font-semibold text-foreground">
        {t("paymentLinkCreate.preview.paymentMethodTitle")}
      </p>
      <div className="mt-3 overflow-hidden rounded-xl border border-border bg-background">
        {transferEnabled ? (
          <button
            type="button"
            onClick={() => onSelectMethod("bank")}
            className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm transition ${
              selectedMethod === "bank"
                ? "bg-surface-muted text-foreground"
                : "text-foreground"
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                selectedMethod === "bank" ? "border-accent" : "border-border"
              }`}
            >
              {selectedMethod === "bank" ? (
                <span className="h-2 w-2 rounded-full bg-accent" />
              ) : null}
            </span>
            <Landmark size={16} className="text-muted-foreground" />
            <span>{t("paymentLinkCreate.preview.paymentMethodBank")}</span>
          </button>
        ) : null}

        {balanceEnabled ? (
          <button
            type="button"
            onClick={() => onSelectMethod("wallet")}
            className={`flex w-full cursor-pointer items-center gap-3 border-t border-border px-4 py-3 text-sm transition ${
              selectedMethod === "wallet"
                ? "bg-surface-muted text-foreground"
                : "text-foreground"
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                selectedMethod === "wallet"
                  ? "border-accent"
                  : "border-border"
              }`}
            >
              {selectedMethod === "wallet" ? (
                <span className="h-2 w-2 rounded-full bg-accent" />
              ) : null}
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8f1e3] text-[10px] font-semibold text-[#b99a58]">
              A
            </div>
            <span>{t("paymentLinkCreate.preview.paymentMethodAntilla")}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};
