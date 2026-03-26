/* eslint-disable react-hooks/set-state-in-effect */
import { Monitor, Smartphone } from "lucide-react";
import { InvoicePreview } from "../../components/InvoicePreview";
import { PaymentPreview } from "../../components/PaymentPreview";
import { PaymentLinkCreateTab } from "../hooks/usePaymentLinkCreateTabs";
import { useTranslation } from "react-i18next";
import type { PaymentPreviewData } from "../types";
import { PreviewFrame } from "../../components/PreviewFrame";
import { type ReactNode, useEffect, useState } from "react";
import { AfterPaymentPreview } from "../../components/AfterPaymentPreview";

type PreviewPanelProps = {
  activeTab: PaymentLinkCreateTab;
  previewData: PaymentPreviewData;
  showConfirmation: boolean;
};

type PreviewVariant = "desktop" | "mobile";
type PreviewMode = "page" | "invoice";

type ToggleButtonProps = {
  isActive: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
};

const ToggleButton = ({ isActive, onClick, label, children }: ToggleButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`flex h-8 w-8 items-center justify-center rounded-md transition cursor-pointer ${
      isActive
        ? "bg-surface-muted text-foreground"
        : "text-muted-foreground"
    }`}
  >
    {children}
  </button>
);

type TabButtonProps = {
  isActive: boolean;
  onClick: () => void;
  label: string;
};

const TabButton = ({ isActive, onClick, label }: TabButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`-mb-px border-b-2 px-1 pb-3 text-sm font-semibold transition cursor-pointer ${
      isActive
        ? "border-accent text-foreground"
        : "border-transparent text-muted-foreground"
    }`}
  >
    {label}
  </button>
);

export const PreviewPanel = ({
  activeTab,
  previewData,
  showConfirmation,
}: PreviewPanelProps) => {
  const { t } = useTranslation();
  const [previewVariant, setPreviewVariant] = useState<PreviewVariant>("desktop");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("page");
  const previewWrapperClass =
    previewVariant === "mobile"
      ? "max-w-[360px]"
      : "w-full max-w-[900px]";

  useEffect(() => {
    if (!previewData.generatePDF && previewMode === "invoice") {
      setPreviewMode("page");
    }
  }, [previewData.generatePDF, previewMode]);

  return (
    <section className="space-y-5 px-10 pt-6 bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <p className="text-md font-semibold text-foreground">
            {t("paymentLinkCreate.preview.title")}
          </p>
          {previewData.generatePDF &&
            activeTab === "after" &&
              (
                <div className="flex items-center gap-6 border-b border-border">
                  <TabButton
                    isActive={previewMode === "page"}
                    onClick={() => setPreviewMode("page")}
                    label={t("paymentLinkCreate.preview.afterPayment")}
                  />
                  <TabButton
                    isActive={previewMode === "invoice"}
                    onClick={() => setPreviewMode("invoice")}
                    label={t("paymentLinkCreate.preview.invoiceTab")}
                  />
                </div>
              )
          }
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
          <ToggleButton
            isActive={previewVariant === "desktop"}
            onClick={() => setPreviewVariant("desktop")}
            label={t("paymentLinkCreate.preview.desktopLabel")}
          >
            <Monitor size={16} />
          </ToggleButton>
          <ToggleButton
            isActive={previewVariant === "mobile"}
            onClick={() => setPreviewVariant("mobile")}
            label={t("paymentLinkCreate.preview.mobileLabel")}
          >
            <Smartphone size={16} />
          </ToggleButton>
        </div>
      </div>
      <div className={`${previewWrapperClass} mx-auto mb-8`}>
        {previewMode === "invoice" ? (
          <PreviewFrame domain="invoice.antillapay.com" variant={previewVariant}>
            <InvoicePreview previewData={previewData} />
          </PreviewFrame>
        ) : activeTab === "payment" ? (
          <PreviewFrame domain="buy.antillapay.com" variant={previewVariant}>
            <PaymentPreview previewData={previewData} variant={previewVariant} isDisabled={true} />
          </PreviewFrame>
        ) : showConfirmation ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-6 text-center text-sm text-[var(--muted-foreground)]">
            {t("paymentLinkCreate.preview.hiddenAfterPayment")}
          </div>
        ) : (
          <PreviewFrame domain="buy.antillapay.com" variant={previewVariant}>
            <AfterPaymentPreview
              previewData={previewData}
              variant={previewVariant}
            />
          </PreviewFrame>
        )}
      </div>

    </section>
  );
};
