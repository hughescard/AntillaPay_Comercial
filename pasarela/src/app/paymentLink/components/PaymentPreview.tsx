/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { currency, type PaymentPreviewData } from "../create/types";
import { AntillaPaymentStep } from "./AntillaPaymentStep";
import { BankPaymentStep } from "./BankPaymentStep";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { PaymentPreviewSummary } from "./PaymentPreviewSummary";
import type {
  AccountMode,
  AccountOption,
  AntillaStep,
  Errors,
  PaymentMethod,
  PaymentPreviewPayParams,
  ProductLine,
} from "./paymentPreview.types";
import { TransactionErrorStep } from "./TransactionErrorStep";

type PaymentPreviewProps = {
  previewData: PaymentPreviewData;
  onPay?: (params?: PaymentPreviewPayParams) => void;
  isPaying?: boolean;
  isDisabled?: boolean;
  payDisabled?: boolean;
  errors?: Errors;
  iframeUrl?: string | null;
  variant?: "desktop" | "mobile";
  paymentError?:boolean;
  onRetry?:()=>void;
};

const getCurrencySymbol = (value: string) =>
  currency.find((option) => option.value === value)?.sym ?? "";

export const formatAmount = (value: number, currencyValue: string) => {
  const normalized = Number(value);
  const safeValue = Number.isFinite(normalized) ? normalized : 0;

  return `${getCurrencySymbol(currencyValue)}${safeValue.toFixed(2)}`;
};

export const PaymentPreview = ({
  previewData,
  onPay,
  isPaying,
  isDisabled = false,
  errors: propErrors = {},
  iframeUrl = null,
  variant = "desktop",
  paymentError = false,
  onRetry = ()=>null,
}: PaymentPreviewProps) => {
  const { t } = useTranslation();
  const transferEnabled = previewData.paymentMethods?.transfer ?? true;
  const balanceEnabled = previewData.paymentMethods?.balance ?? true;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    transferEnabled ? "bank" : "wallet"
  );
  const [accountMode, setAccountMode] = useState<AccountMode>("cuba");
  const [contactEmail, setContactEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [antillaStep, setAntillaStep] = useState<AntillaStep>("login");
  const [localErrors, setLocalErrors] = useState<Errors>({});
  const errors: Errors = { ...propErrors, ...localErrors };

  const accountOptions: AccountOption[] = [
    { value: "cuba", label: t("paymentLinks.cubaAccount") },
    { value: "foreing", label: t("paymentLinks.foreingAccount") },
  ];

  const handleAccountModeChange = (value: AccountMode) => {
    setAccountMode(value);
    setLocalErrors((prev) => ({ ...prev, accountMode: undefined }));
  };

  useEffect(() => {
    if (selectedMethod === "bank" && !transferEnabled && balanceEnabled) {
      setSelectedMethod("wallet");
    }

    if (selectedMethod === "wallet" && !balanceEnabled && transferEnabled) {
      setSelectedMethod("bank");
    }
  }, [transferEnabled, balanceEnabled, selectedMethod]);

  useEffect(() => {
    if (selectedMethod !== "wallet") {
      setAntillaStep("login");
    }
  }, [selectedMethod]);

  const fallbackTitle = t("paymentLinkCreate.preview.titleValue");
  const titleValue = previewData.title.trim() || fallbackTitle;
  const descriptionValue = previewData.description.trim();
  const additionalInfoValue = previewData.additionalInfo.trim();
  const additionalInfoText =
    additionalInfoValue ||
    t("paymentLinkCreate.preview.additionalInfoPlaceholder");

  const selectedProducts = Array.isArray(previewData.products)
    ? previewData.products
    : [];


  const productLines: ProductLine[] = selectedProducts
    .map((product) => {
      const priceList = Array.isArray(product.prices) ? product.prices : [];
      const priceMatch =
        priceList.find((price) => price.currency === previewData.currency) ??
        priceList[0];
      if (!priceMatch) return null;

      const unitValue = Number(priceMatch.value) / 100;
      if (!Number.isFinite(unitValue)) return null;

      return {
        id: product.id,
        name: product.name,
        image: product.image ?? null,
        quantity: product.quantity ? product.quantity : 1,
        currency: priceMatch.currency,
        unitValue,
        lineTotal: unitValue * (product.quantity ? product.quantity : 1),
      };
    })
    .filter((line): line is ProductLine => line !== null);


  const handleRetry =() => {
    setAntillaStep('login');
    onRetry();
  }
  return (
    <div
      className={
        variant === "mobile"
          ? "grid h-full gap-6"
          : "grid h-full gap-8 lg:grid-cols-[minmax(0,1fr)_420px]"
      }
    >
      <PaymentPreviewSummary
        variant={variant}
        title={titleValue}
        description={descriptionValue}
        productLines={productLines}
        amountValue={formatAmount(previewData.amount, previewData.currency)}
        additionalInfoEnabled={previewData.additionalInfoEnabled}
        additionalInfoText={additionalInfoText}
        formatAmount={formatAmount}
      />

      <div>
        {iframeUrl ? (
          <div className="h-full rounded-xl bg-surface p-2">
            <iframe
              title="Payment Operation"
              src={iframeUrl}
              className="h-full min-h-130 w-full rounded-lg border border-border bg-background"
              allow="payment"
            />
          </div>
        ) : (
        <form className="flex flex-col h-full gap-8 rounded-xl bg-surface p-6">
          <div className="flex justify-center">
            <Image
              width={130}
              height={130}
              src="/pasarela/logo.png"
              alt="AntillaPay"
              className="object-contain"
            />
          </div>
           {
            paymentError ? (
              <TransactionErrorStep 
                onRetry={()=>handleRetry()}
              />
            ) :
            (
              <>
                  <PaymentMethodSelector
                    transferEnabled={transferEnabled}
                    balanceEnabled={balanceEnabled}
                    selectedMethod={selectedMethod}
                    onSelectMethod={setSelectedMethod}
                  />

         
                 {selectedMethod === "bank" ? (
                    <BankPaymentStep
                      accountMode={accountMode}
                      accountOptions={accountOptions}
                      errors={errors}
                      contactEmail={contactEmail}
                      contactName={contactName}
                      isDisabled={isDisabled}
                      isPaying={isPaying}
                      onAccountModeChange={handleAccountModeChange}
                      onContactEmailChange={setContactEmail}
                      onContactNameChange={setContactName}
                      onPay={onPay}
                    />
                  ) : null}

                  {selectedMethod === "wallet" ? (
                    <AntillaPaymentStep
                      antillaStep={antillaStep}
                      isDisabled={isDisabled}
                      onNextStep={() => setAntillaStep("verify")}
                      onPay={onPay}
                    />
                  ) : null}
              </>
            )
          }

         
        </form>
        )}
      </div>
    </div>
  );
};
