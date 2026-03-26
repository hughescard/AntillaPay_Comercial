import { Mail, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InputCustom } from "@/common/components/ui/InputCustom";
import type {
  AccountMode,
  AccountOption,
  Errors,
  PaymentPreviewPayParams,
} from "./paymentPreview.types";

type BankPaymentStepProps = {
  accountMode: AccountMode;
  accountOptions: AccountOption[];
  errors: Errors;
  contactEmail: string;
  contactName: string;
  isDisabled: boolean;
  isPaying?: boolean;
  onAccountModeChange: (value: AccountMode) => void;
  onContactEmailChange: (value: string) => void;
  onContactNameChange: (value: string) => void;
  onPay?: (params?: PaymentPreviewPayParams) => void;
};

export const BankPaymentStep = ({
  accountMode,
  accountOptions,
  errors,
  contactEmail,
  contactName,
  isDisabled,
  isPaying,
  onAccountModeChange,
  onContactEmailChange,
  onContactNameChange,
  onPay,
}: BankPaymentStepProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8">
      <InputCustom
        id="accountMode"
        type="select"
        label={t("paymentLinks.typeAccount")}
        placeholder={t("paymentLinks.typeAccountPlaceholder")}
        value={accountMode}
        action={(value) => {
          if (value === "cuba" || value === "foreing") {
            onAccountModeChange(value);
          }
        }}
        options={accountOptions}
        error={errors.accountMode ? t(errors.accountMode.id) : undefined}
        tabIndex={2}
      />

      <div className="space-y-2">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">
            {t("paymentLinkCreate.preview.contactTitle")}
          </p>
          <label className="text-xs text-muted-foreground">
            {t("paymentLinkCreate.preview.contactEmailLabel")}
          </label>
        </div>
        <div className="flex h-10 w-full items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm">
          <Mail size={14} />
          <input
            type="email"
            placeholder={t("paymentLinkCreate.preview.contactEmail")}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
            disabled={isDisabled}
            value={contactEmail}
            onChange={(event) => onContactEmailChange(event.target.value)}
          />
        </div>
        {errors.contactEmail ? (
          <p className="text-xs text-danger" role="alert">
            {t(errors.contactEmail.id)}
          </p>
        ) : null}

        <label className="text-xs text-muted-foreground">
          {t("paymentLinkCreate.preview.contactName")}
        </label>
        <div className="flex h-10 w-full items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm">
          <User size={14} />
          <input
            type="text"
            placeholder={t("paymentLinkCreate.preview.contactName")}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
            disabled={isDisabled}
            value={contactName}
            onChange={(event) => onContactNameChange(event.target.value)}
          />
        </div>
        {errors.contactName ? (
          <p className="text-xs text-danger" role="alert">
            {t(errors.contactName.id)}
          </p>
        ) : null}
      </div>
      {errors.general ? (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger" role="alert">
          {t(errors.general.id)}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() =>
          onPay?.({
            selectedMethod: "bank",
            accountMode,
            contactEmail,
            contactName,
          })
        }
        disabled={isDisabled}
        className="w-full cursor-pointer rounded-lg bg-accent py-2 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPaying
          ? t("paymentLinkCreate.preview.processingPayAction")
          : t("paymentLinkCreate.preview.payAction")}
      </button>
    </div>
  );
};
