import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { currency, type CatalogProduct, type SelectedProduct } from "../../types";
import { getInitials, minorUnitsToMajor, resolveProductImageUrl } from "./utils";
import Image from "next/image";

type ProductPickerProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenDrawer: () => void;
  catalogProducts: CatalogProduct[];
  selectedProducts: SelectedProduct[];
  onSelectProduct: (product: CatalogProduct) => void;
};

export const ProductPicker = ({
  searchQuery,
  onSearchChange,
  onOpenDrawer,
  catalogProducts,
  selectedProducts,
  onSelectProduct,
}: ProductPickerProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedIds = useMemo(
    () => new Set(selectedProducts.map((product) => product.id)),
    [selectedProducts]
  );
  const availableProducts = useMemo(
    () => catalogProducts.filter((product) => !selectedIds.has(product.id)),
    [catalogProducts, selectedIds]
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    if (!isOpen) return;
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);


  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm font-medium text-[var(--foreground)] cursor-pointer"
      >
        {t("paymentLinkCreate.paymentSettings.productPlaceholder")}
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t(
                "paymentLinkCreate.paymentSettings.productPlaceholder"
              )}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2 pl-9 pr-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
            />
          </div>

          <button
            type="button"
            onClick={onOpenDrawer}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] cursor-pointer px-3 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
          >
            <Plus size={14} />
            {t("paymentLinkCreate.paymentSettings.addNewProduct")}
          </button>

          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {availableProducts.map((product) => (
              <CatalogProductOption
                key={product.id}
                product={product}
                isSelected={selectedIds.has(product.id)}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

type CatalogProductOptionProps = {
  product: CatalogProduct;
  isSelected: boolean;
  onSelect: (product: CatalogProduct) => void;
};

const CatalogProductOption = ({
  product,
  isSelected,
  onSelect,
}: CatalogProductOptionProps) => {
  const imageUrl = resolveProductImageUrl(product.image);
  const firstPrice = Array.isArray(product.prices) ? product.prices[0] : undefined;
  const currencySymbol = firstPrice
    ? currency.find((item) => item.value === firstPrice.currency)?.sym ?? ""
    : "";
  const priceLabel = firstPrice
    ? `${currencySymbol}${minorUnitsToMajor(firstPrice.value).toFixed(2)}`
    : "--";

  return (
    <button
      type="button"
      disabled={isSelected}
      onClick={() => onSelect(product)}
      className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-sm transition ${
        isSelected
          ? "cursor-default text-[var(--muted-foreground)]"
          : "cursor-pointer text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
      }`}
    >
      <div className="flex items-center gap-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            width={36}
            height={36}
            className="rounded-md border border-[var(--border)] object-cover"
            unoptimized
            sizes="36px"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--surface-muted)] text-[10px] font-semibold text-[var(--muted-foreground)]">
            {getInitials(product.name)}
          </div>
        )}
        <div>
          <div className="text-sm font-semibold">{product.name}</div>
          <div className="text-xs text-[var(--muted-foreground)]">
            {priceLabel}
          </div>
        </div>
      </div>
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-md border ${
          isSelected
            ? "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted-foreground)]"
            : "border-[var(--accent)] text-[var(--accent)]"
        }`}
      >
        {isSelected ? <Check size={14} /> : <Plus size={14} />}
      </span>
    </button>
  );
};
