import { useTranslation } from "react-i18next";

type ProductHeaderProps = {
  selectedCount: number;
};

export const ProductHeader = ({ selectedCount }: ProductHeaderProps) => {
  const { t } = useTranslation();
  const countLabel = t("paymentLinkCreate.paymentSettings.productsCount", {
    count: selectedCount,
  });

  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-[var(--foreground)]">
        {t("paymentLinkCreate.paymentSettings.productTitle")}
      </h3>
      {selectedCount > 0 && (
        <span className="text-xs text-[var(--muted-foreground)]">
          ({countLabel})
        </span>
      )}
    </div>
  );
};
