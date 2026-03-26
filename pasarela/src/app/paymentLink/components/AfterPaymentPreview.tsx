import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PaymentPreviewData } from "../create/types";
import { PaymentPreviewSummary } from "./PaymentPreviewSummary";
import { ProductLine } from "./paymentPreview.types";
import { formatAmount } from "./PaymentPreview";

type AfterPaymentPreviewProps = {
  previewData: PaymentPreviewData;
  variant?: "desktop" | "mobile";
};

export const AfterPaymentPreview = ({
  previewData,
  variant = "desktop",
}: AfterPaymentPreviewProps) => {
  const { t } = useTranslation();
  const customMessage = previewData.replaceMessage.trim();
  const thanksTitle = previewData.replaceMessageEnabled
    ? customMessage ||
      t("paymentLinkCreate.preview.replaceMessagePlaceholder")
    : t("paymentLinkCreate.preview.thanksTitle");
  const fallbackTitle = t("paymentLinkCreate.preview.titleValue");
  const titleValue = previewData.title.trim() || fallbackTitle;
  const descriptionValue = previewData.description.trim();
  const selectedProducts = Array.isArray(previewData.products)
    ? previewData.products
    : [];
  const additionalInfoValue = previewData.additionalInfo.trim();
  const additionalInfoText =
    additionalInfoValue ||
    t("paymentLinkCreate.preview.additionalInfoPlaceholder");
  

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
      <div className="flex flex-col items-center justif-start text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f7ee] text-[#16a34a]">
          <Check size={24} />
        </div>
        <h4 className="mt-4 text-base font-semibold text-foreground">
          {thanksTitle}
        </h4>
        <p className="mt-2 text-xs text-muted-foreground">
          {t("paymentLinkCreate.preview.thanksBody")}
        </p>
        <div className="mt-4 w-full rounded-lg border border-border bg-surface-muted px-4 py-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground">
          {t("paymentLinkCreate.preview.brand")}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {formatAmount(previewData.amount, previewData.currency)}
        </p>
      </div>
    </div>
  );
};
