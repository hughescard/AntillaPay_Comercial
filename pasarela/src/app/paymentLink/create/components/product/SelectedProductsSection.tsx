import { MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { currency, type SelectedProduct } from "../../types";
import { getInitials, minorUnitsToMajor, resolveProductImageUrl } from "./utils";
import Image from "next/image";

type SelectedProductsSectionProps = {
  selectedProducts: SelectedProduct[];
  onQuantityChange: (id: string, value: string) => void;
  onToggleCustomerQuantity: (id: string) => void;
  onEditProduct: (product: SelectedProduct) => void;
  onRemoveProduct: (id: string) => void;
  onOpenDrawer: () => void;
};

export const SelectedProductsSection = ({
  selectedProducts,
  onQuantityChange,
  onEditProduct,
  onRemoveProduct,
  onOpenDrawer,
}: SelectedProductsSectionProps) => {
  const { t } = useTranslation();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (selectedProducts.length === 0) return null;

  return (
    <div className="space-y-3">
      {selectedProducts.map((product) => (
        <SelectedProductCard
          key={product.id}
          product={product}
          isMenuOpen={openMenuId === product.id}
          onToggleMenu={() =>
            setOpenMenuId((prev) => (prev === product.id ? null : product.id))
          }
          onCloseMenu={() => setOpenMenuId(null)}
          onQuantityChange={onQuantityChange}
          onEditProduct={onEditProduct}
          onRemoveProduct={onRemoveProduct}
        />
      ))}

      <button
        type="button"
        onClick={onOpenDrawer}
        className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-[var(--accent)]"
      >
        <Plus size={14} />
        {t("paymentLinkCreate.paymentSettings.addAnotherProduct")}
      </button>
    </div>
  );
};

type SelectedProductCardProps = {
  product: SelectedProduct;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onQuantityChange: (id: string, value: string) => void;
  onEditProduct: (product: SelectedProduct) => void;
  onRemoveProduct: (id: string) => void;
};

const SelectedProductCard = ({
  product,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  onQuantityChange,
  onEditProduct,
  onRemoveProduct,
}: SelectedProductCardProps) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageUrl = resolveProductImageUrl(product.image);
  const firstPrice = Array.isArray(product.prices) ? product.prices[0] : undefined;
  const currencySymbol = firstPrice
    ? currency.find((item) => item.value === firstPrice.currency)?.sym ?? ""
    : "";
  const priceLabel = firstPrice
    ? `${currencySymbol}${minorUnitsToMajor(firstPrice.value).toFixed(2)}`
    : "--";

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      onCloseMenu();
    };

    if (!isMenuOpen) return;
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMenuOpen, onCloseMenu]);

  return (
    <div
      ref={containerRef}
      className="relative space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              width={40}
              height={40}
              className="rounded-md border border-[var(--border)] object-cover"
              unoptimized
              sizes="40px"
            />

          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--surface-muted)] text-xs font-semibold text-[var(--muted-foreground)]">
              {getInitials(product.name)}
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-[var(--foreground)]">
              {product.name}
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              {priceLabel}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleMenu}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] cursor-pointer"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute right-3 top-12 z-20 w-44 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 text-sm shadow-lg">
          <button
            type="button"
            onClick={() => {
              onEditProduct(product);
              onCloseMenu();
            }}
            className="w-full rounded-md px-3 py-2 text-left text-[var(--foreground)] hover:bg-[var(--surface-muted)] cursor-pointer"
          >
            {t("paymentLinkCreate.paymentSettings.editProduct")}
          </button>
          <button
            type="button"
            onClick={() => {
              onRemoveProduct(product.id);
              onCloseMenu();
            }}
            className="w-full rounded-md px-3 py-2 text-left text-[var(--danger)] hover:bg-[var(--danger-surface)] cursor-pointer"
          >
            {t("paymentLinkCreate.paymentSettings.removeProduct")}
          </button>
        </div>
      )}
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          value={product.quantity}
          onChange={(event) =>
            onQuantityChange(product.id, event.target.value)
          }
          className="w-16 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-center text-sm text-[var(--foreground)]"
        />
        <span className="text-xs text-[var(--muted-foreground)]">
          {t("paymentLinkCreate.paymentSettings.quantityLabel")}
        </span>
      </div>
    </div>
  );
};
