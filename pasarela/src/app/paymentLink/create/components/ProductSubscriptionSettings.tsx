import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductDrawer } from "./product/ProductDrawer";
import { ProductHeader } from "./product/ProductHeader";
import { ProductPicker } from "./product/ProductPicker";
import { CurrencyAmountSection } from "./product/CurrencyAmountSection";
import { SelectedProductsSection } from "./product/SelectedProductsSection";
import { currency, type CatalogProduct, type CatalogProductCreate, type PaymentPreviewData, type SelectedProduct } from "../types";
import { getPreviewTotals, majorUnitsToMinor, toMoneyInputValue } from "./product/utils";
import { useCatalogProducts } from "../hooks/useCatalogProducts";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";

type ProductSubscriptionSettingsProps = {
  onSelectedProductsChange?: (products: SelectedProduct[]) => void;
  onPreviewChange: (data: PaymentPreviewData) => void;
  previewData: PaymentPreviewData;
  titleError: boolean;
  amountError: boolean;
};

export const ProductSubscriptionSettings = ({
  onSelectedProductsChange,
  onPreviewChange,
  previewData,
  titleError,
  amountError,
}: ProductSubscriptionSettingsProps) => {
  const { t } = useTranslation();
  const { products: catalogProducts, setProducts: setCatalogProducts } =
    useCatalogProducts();
  const { createProduct, isLoading: isCreatingProduct } = useCreateProduct();
  const { updateProduct, isLoading: isUpdatingProduct } = useUpdateProduct();
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [hasUserModifiedSelection, setHasUserModifiedSelection] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftImageFile, setDraftImageFile] = useState<File | null>(null);
  const [draftImageUrl, setDraftImageUrl] = useState<string | null>(null);
  const [amountValue, setDraftAmount] = useState("0");
  const [previewQuantity, setPreviewQuantity] = useState(1);
  const currencyList = currency
  const isSubmittingProduct = isCreatingProduct || isUpdatingProduct;

  const filteredCatalog = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return catalogProducts;
    return catalogProducts.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery)
    );
  }, [catalogProducts, searchQuery]);

  const { formattedAmount, formattedSubtotal } = getPreviewTotals(
    amountValue,
    previewQuantity
  );

  useEffect(() => {
    if (!onSelectedProductsChange) return;
    onSelectedProductsChange(selectedProducts);
  }, [onSelectedProductsChange, selectedProducts]);

  useEffect(() => {
    if (hasUserModifiedSelection) return;
    if (catalogProducts.length === 0) return;
  }, [catalogProducts, hasUserModifiedSelection]);

  const updatePreview = (next: Partial<PaymentPreviewData>) => {
    onPreviewChange({ ...previewData, ...next });
  };

  const paymentMethods = previewData.paymentMethods ?? {
    transfer: true,
    balance: true,
  };

  const updatePaymentMethods = (next: Partial<typeof paymentMethods>) => {
    const updated = {
      ...paymentMethods,
      ...next,
    };

    if (!updated.transfer && !updated.balance) return;

    updatePreview({ paymentMethods: updated });
  };

  const handleSelectProduct = (product: CatalogProduct) => {
    setHasUserModifiedSelection(true);
    setSelectedProducts((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [
        ...prev,
        { ...product, quantity: 1, allowCustomerQuantity: false },
      ];
    });
  };

  const handleQuantityChange = (id: string, value: string) => {
    setHasUserModifiedSelection(true);
    const parsed = Number.parseInt(value, 10);
    const nextValue = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    setSelectedProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, quantity: nextValue } : product
      )
    );
  };

  const handleToggleCustomerQuantity = (id: string) => {
    setHasUserModifiedSelection(true);
    setSelectedProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              allowCustomerQuantity: !product.allowCustomerQuantity,
            }
          : product
      )
    );
  };

  const resetDraft = () => {
    setDraftName("");
    setDraftDescription("");
    setDraftImageFile(null);
    setDraftImageUrl(null);
    setDraftAmount("0");
    setPreviewQuantity(1);
    setShowPreview(true);
    setEditingProductId(null);
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
    setShowPreview(true);
    setDraftImageFile(null);
    setDraftImageUrl(null);
  };

  const handleEditSelectedProduct = (product: SelectedProduct) => {
    setHasUserModifiedSelection(true);
    const amountValue =
      product.prices?.find((item) => item.currency === previewData.currency)
        ?.value || 0;
    setEditingProductId(product.id);
    setDrawerOpen(true);
    setShowPreview(true);
    setDraftName(product.name);
    setDraftDescription(product.description ?? "");
    setDraftImageFile(null);
    setDraftImageUrl(product.image ?? null);
    setDraftAmount(toMoneyInputValue(amountValue));
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    resetDraft();
  };

  const handleSubmitProduct = async () => {
    if (isSubmittingProduct) return;
    setHasUserModifiedSelection(true);
    const trimmedName = draftName.trim();
    const name =
      trimmedName ||
      t("paymentLinkCreate.paymentSettings.newProductNameFallback");
    const priceLabel = majorUnitsToMinor(amountValue);
    const payload:CatalogProductCreate = {
      name,
      prices: [{
        value: priceLabel,
        currency: previewData.currency
      }],
      description: draftDescription.trim(),
      imageFile: draftImageFile ?? undefined,
      status:'active'
    };


    try {
      if (editingProductId) {
        const updated = await updateProduct(editingProductId, payload);
        if (!updated) return;
        const nextProduct: CatalogProduct = updated;
        setCatalogProducts((prev) =>
          prev.map((product) =>
            product.id === editingProductId ? nextProduct : product
          )
        );
        setSelectedProducts((prev) =>
          prev.map((product) =>
            product.id === editingProductId
              ? { ...product, ...nextProduct }
              : product
          )
        );
        handleCloseDrawer();
        return;
      }

      const created = await createProduct(payload);
      if (!created) return;
      const nextProduct = created;

      setCatalogProducts((prev) => [nextProduct, ...prev]);
      setSelectedProducts((prev) => [
        ...prev,
        { ...nextProduct, quantity: 1, allowCustomerQuantity: false },
      ]);
      handleCloseDrawer();
    } catch {
      return;
    }
  };

  const handleRemoveProduct = (id: string) => {
    setHasUserModifiedSelection(true);
    setSelectedProducts((prev) =>
      prev.filter((product) => product.id !== id)
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <ProductHeader selectedCount={selectedProducts.length} />

        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-[var(--foreground)]">
              {t("paymentLinkCreate.paymentSettings.titleLabel")}
              <span className="ml-1 text-danger">*</span>
            </div>
            <input
              type="text"
              placeholder={t("paymentLinkCreate.paymentSettings.titlePlaceholder")}
              value={previewData.title}
              onChange={(event) => updatePreview({ title: event.target.value })}
              className={`w-full placeholder:text-gray-400 rounded-lg border px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] ${
                titleError ? "border-danger" : "border-[var(--border)]"
              }`}
            />
            {titleError && (
              <p className="text-sm text-danger" role="alert">
                {t("paymentLinkCreate.paymentSettings.titleRequiredError")}
              </p>
            )}

            <div className="flex items-center text-sm font-semibold mt-2 text-[var(--foreground)]">
              {t("paymentLinkCreate.paymentSettings.descriptionLabel")}
            </div>
            <textarea
              rows={4}
              placeholder={t(
                "paymentLinkCreate.paymentSettings.descriptionPlaceholder"
              )}
              value={previewData.description}
              onChange={(event) =>
                updatePreview({ description: event.target.value })
              }
              className="w-full placeholder:text-gray-400 resize-none rounded-lg border border-[var(--border)]  px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
            />
          </div>
        </div>

        <ProductPicker
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenDrawer={handleOpenDrawer}
          catalogProducts={filteredCatalog}
          selectedProducts={selectedProducts}
          onSelectProduct={handleSelectProduct}
        />
        <SelectedProductsSection
          selectedProducts={selectedProducts}
          onQuantityChange={handleQuantityChange}
          onToggleCustomerQuantity={handleToggleCustomerQuantity}
          onEditProduct={handleEditSelectedProduct}
          onRemoveProduct={handleRemoveProduct}
          onOpenDrawer={handleOpenDrawer}
          />

        {selectedProducts.length === 0 && (
          <CurrencyAmountSection
            currency={previewData.currency}
            amount={previewData.amount}
            onCurrencyChange={(value) => updatePreview({ currency: value })}
            onAmountChange={(value) => updatePreview({ amount: value })}
            amountError={amountError}
          />
        )}

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={previewData.additionalInfoEnabled}
              onChange={(event) =>
                updatePreview({ additionalInfoEnabled: event.target.checked })
              }
              className="h-4 w-4 rounded border border-[var(--border)] text-[var(--accent)]"
            />
            {t("paymentLinkCreate.paymentSettings.additionalInfoToggle")}
          </label>
          {previewData.additionalInfoEnabled ? (
            <textarea
              rows={3}
              value={previewData.additionalInfo}
              onChange={(event) =>
                updatePreview({ additionalInfo: event.target.value })
              }
              placeholder={t(
                "paymentLinkCreate.paymentSettings.additionalInfoPlaceholder"
              )}
              className="w-full placeholder:text-gray-400 resize-none rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
            />
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-[var(--foreground)]">
              {t("paymentLinkCreate.paymentSettings.paymentMethodsLabel")}
              <span className="ml-1 text-danger">*</span>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={paymentMethods.transfer}
              onChange={(event) =>
                updatePaymentMethods({ transfer: event.target.checked })
              }
              className="h-4 w-4 rounded border border-[var(--border)] text-[var(--accent)]"
            />
            {t("paymentLinkCreate.paymentSettings.paymentMethodBank")}
          </label>

          {paymentMethods.transfer ? (
            <div className="flex items-start gap-2 rounded-lg border border-[var(--status-review)] bg-[var(--surface-muted)] px-3 py-2 text-xs text-[var(--status-review)]">
              <span className="mt-0.5 h-4 w-4 rounded-full border border-[var(--status-review)] flex items-center justify-center text-[10px] font-semibold">
                !
              </span>
              <div>
                <p className="font-semibold">
                  {t("paymentLinkCreate.paymentSettings.paymentMethodWarningTitle")}
                </p>
                <p>
                  {t("paymentLinkCreate.paymentSettings.paymentMethodWarningBody")}
                </p>
              </div>
            </div>
          ) : null}

          <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={paymentMethods.balance}
              onChange={(event) =>
                updatePaymentMethods({ balance: event.target.checked })
              }
              className="h-4 w-4 rounded border border-[var(--border)] text-[var(--accent)]"
            />
            {t("paymentLinkCreate.paymentSettings.paymentMethodAntilla")}
          </label>
        </div>
      </div>

      <ProductDrawer
        open={drawerOpen}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview((prev) => !prev)}
        onClose={handleCloseDrawer}
        onCreate={handleSubmitProduct}
        primaryActionLabel={
          editingProductId
            ? t("paymentLinkCreate.paymentSettings.saveChangesButton")
            : t("paymentLinkCreate.paymentSettings.addProductButton")
        }
        isSubmitting={isSubmittingProduct}
        draftName={draftName}
        onDraftNameChange={setDraftName}
        draftDescription={draftDescription}
        onDraftDescriptionChange={setDraftDescription}
        draftImageFile={draftImageFile}
        draftImageUrl={draftImageUrl}
        onDraftImageChange={setDraftImageFile}
        draftAmount={amountValue}
        onDraftAmountChange={setDraftAmount}
        previewQuantity={previewQuantity}
        onPreviewQuantityChange={setPreviewQuantity}
        formattedAmount={formattedAmount}
        formattedSubtotal={formattedSubtotal}
        currencyList={currencyList}
        currentCurrency={previewData.currency}
        onCurrentCurrencyChange={(value) => updatePreview({ currency: value })}
      />
    </div>
  );
};
