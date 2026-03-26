import { PreviewAdditionalInfo } from "./PreviewAdditionalInfo";
import { PreviewDescription } from "./PreviewDescription";
import { PreviewProductsSection } from "./PreviewProductsSection";
import type { ProductLine } from "./paymentPreview.types";

type PaymentPreviewSummaryProps = {
  variant: "desktop" | "mobile";
  title: string;
  description: string;
  productLines: ProductLine[];
  amountValue: string;
  additionalInfoEnabled: boolean;
  additionalInfoText: string;
  formatAmount: (value: number, currencyValue: string) => string;
};

export const PaymentPreviewSummary = ({
  variant,
  title,
  description,
  productLines,
  amountValue,
  additionalInfoEnabled,
  additionalInfoText,
  formatAmount,
}: PaymentPreviewSummaryProps) => {
  return (
    <div className={variant === "mobile" ? "space-y-4" : "h-full border-r border-border pr-10"}>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>

      <PreviewDescription description={description} />

      <div className="my-4">
        <PreviewProductsSection productLines={productLines} formatAmount={formatAmount} />
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-muted-foreground">
        {amountValue}
      </div>

      <PreviewAdditionalInfo enabled={additionalInfoEnabled} text={additionalInfoText} />
    </div>
  );
};
