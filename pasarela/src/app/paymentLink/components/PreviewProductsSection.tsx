import Image from "next/image";
import { useTranslation } from "react-i18next";
import { getInitials, resolveProductImageUrl } from "@/app/paymentLink/create/components/product/utils";
import type { ProductLine } from "./paymentPreview.types";

type PreviewProductsSectionProps = {
  productLines: ProductLine[];
  formatAmount: (value: number, currencyValue: string) => string;
};

export const PreviewProductsSection = ({
  productLines,
  formatAmount,
}: PreviewProductsSectionProps) => {
  const { t } = useTranslation();

  if (productLines.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-foreground">
        {t("paymentLinkCreate.paymentSettings.productsCount", {
          count: productLines.length,
        })}
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="divide-y divide-border">
          {productLines.map((product) => {
            const imageUrl = resolveProductImageUrl(product.image);
            return (
              <div
                key={product.id}
                className="flex items-start justify-between px-3 py-2 text-xs"
              >
                <div className="flex items-start gap-2">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      width={32}
                      height={32}
                      className="mt-0.5 rounded-md border border-border object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-surface-muted text-[10px] font-semibold text-muted-foreground">
                      {getInitials(product.name)}
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <div className="font-medium text-foreground">{product.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {product.quantity} x {formatAmount(product.unitValue, product.currency)}
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-foreground">
                  {formatAmount(product.lineTotal, product.currency)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
