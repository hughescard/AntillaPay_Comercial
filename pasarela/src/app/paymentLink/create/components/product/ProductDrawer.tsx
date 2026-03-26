import { Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { currencyType } from "../../types";
import { resolveProductImageUrl } from "./utils";
import Image from "next/image";

type ProductDrawerProps = {
  open: boolean;
  showPreview: boolean;
  onTogglePreview: () => void;
  onClose: () => void;
  onCreate: () => void;
  primaryActionLabel: string;
  isSubmitting?: boolean;
  draftName: string;
  onDraftNameChange: (value: string) => void;
  draftDescription: string;
  onDraftDescriptionChange: (value: string) => void;
  draftImageFile: File | null;
  draftImageUrl?: string | null;
  onDraftImageChange: (file: File | null) => void;
  draftAmount: string;
  onDraftAmountChange: (value: string) => void;
  previewQuantity: number;
  onPreviewQuantityChange: (value: number) => void;
  formattedAmount: string;
  formattedSubtotal: string;
  currencyList: Record<"value" | "label", string>[],
  currentCurrency: currencyType;
  onCurrentCurrencyChange: (value: currencyType) => void;
};

export const ProductDrawer = ({
  open,
  showPreview,
  onTogglePreview,
  onClose,
  onCreate,
  primaryActionLabel,
  isSubmitting = false,
  draftName,
  onDraftNameChange,
  draftDescription,
  onDraftDescriptionChange,
  draftImageFile,
  draftImageUrl,
  onDraftImageChange,
  draftAmount,
  onDraftAmountChange,
  previewQuantity,
  onPreviewQuantityChange,
  formattedAmount,
  formattedSubtotal,
  currencyList,
  currentCurrency,
  onCurrentCurrencyChange,
}: ProductDrawerProps) => (
  <div
    className={`fixed inset-0 h-full z-[60] !mt-0 ${
      open ? "pointer-events-auto" : "pointer-events-none"
    }`}
  >
    <div
      className={`absolute inset-0 bg-[var(--overlay)] transition-opacity duration-300 cursor-pointer ${
        open ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    />
    <div
      className={`absolute right-0 top-0 h-full w-full max-w-[960px] transform bg-[var(--background)] shadow-2xl transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <form
        className="flex h-full flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          if (isSubmitting) return;
          onCreate();
        }}
      >
        <DrawerHeader
          showPreview={showPreview}
          onTogglePreview={onTogglePreview}
          onClose={onClose}
        />

        <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
          <div className="flex-1 overflow-y-auto p-6">
            <DrawerForm
              draftName={draftName}
              onDraftNameChange={onDraftNameChange}
              draftDescription={draftDescription}
              onDraftDescriptionChange={onDraftDescriptionChange}
              draftImageFile={draftImageFile}
              draftImageUrl={draftImageUrl}
              onDraftImageChange={onDraftImageChange}
              draftAmount={draftAmount}
              onDraftAmountChange={onDraftAmountChange}
              currencyList={currencyList}
              currentCurrency={currentCurrency}
              onCurrentCurrencyChange={onCurrentCurrencyChange}
            />
          </div>

          {showPreview && (
            <DrawerPreview
              previewQuantity={previewQuantity}
              onPreviewQuantityChange={onPreviewQuantityChange}
              formattedAmount={formattedAmount}
              formattedSubtotal={formattedSubtotal}
            />
          )}
        </div>

        <DrawerFooter
          onClose={onClose}
          primaryActionLabel={primaryActionLabel}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  </div>
);

type DrawerHeaderProps = {
  showPreview: boolean;
  onTogglePreview: () => void;
  onClose: () => void;
};

const DrawerHeader = ({
  showPreview,
  onTogglePreview,
  onClose,
}: DrawerHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
      <h2 className="text-lg font-semibold text-[var(--foreground)]">
        {t("paymentLinkCreate.paymentSettings.drawerTitle")}
      </h2>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onTogglePreview}
          className="text-xs font-semibold text-[var(--accent)] cursor-pointer"
        >
          {showPreview
            ? t("paymentLinkCreate.paymentSettings.closePreview")
            : t("paymentLinkCreate.paymentSettings.openPreview")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

type DrawerFormProps = {
  draftName: string;
  onDraftNameChange: (value: string) => void;
  draftDescription: string;
  onDraftDescriptionChange: (value: string) => void;
  draftImageFile: File | null;
  draftImageUrl?: string | null;
  onDraftImageChange: (file: File | null) => void;
  draftAmount: string;
  onDraftAmountChange: (value: string) => void;
  currencyList: Record<"value" | "label", string>[];
  currentCurrency: currencyType;
  onCurrentCurrencyChange: (value: currencyType) => void;
};

const DrawerForm = ({
  draftName,
  onDraftNameChange,
  draftDescription,
  onDraftDescriptionChange,
  draftImageFile,
  draftImageUrl,
  onDraftImageChange,
  draftAmount,
  onDraftAmountChange,
  currencyList,
  currentCurrency,
  onCurrentCurrencyChange
}: DrawerFormProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imagePreviewUrl = useMemo(
    () => (draftImageFile ? URL.createObjectURL(draftImageFile) : null),
    [draftImageFile]
  );

  useEffect(
    () => () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    },
    [imagePreviewUrl]
  );

  const resolvedImageUrl =
    imagePreviewUrl ?? resolveProductImageUrl(draftImageUrl);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onDraftImageChange(file);
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-sm font-semibold text-[var(--foreground)]">
          {t("paymentLinkCreate.paymentSettings.productNameLabel")}
          <span className="ml-1 text-danger">*</span>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          {t("paymentLinkCreate.paymentSettings.productNameHelper")}
        </p>
        <input
          type="text"
          value={draftName}
          onChange={(event) => onDraftNameChange(event.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold text-[var(--foreground)]">
          {t("paymentLinkCreate.paymentSettings.descriptionLabel")}
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          {t("paymentLinkCreate.paymentSettings.productDescriptionHelper")}
        </p>
        <textarea
          rows={4}
          value={draftDescription}
          onChange={(event) => onDraftDescriptionChange(event.target.value)}
          placeholder={t(
            "paymentLinkCreate.paymentSettings.descriptionPlaceholder"
          )}
          className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold text-[var(--foreground)]">
          {t("paymentLinkCreate.paymentSettings.imageLabel")}
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          {t("paymentLinkCreate.paymentSettings.imageHelper")}
        </p>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] cursor-pointer"
          >
            <Upload size={14} />
            {t("paymentLinkCreate.paymentSettings.upload")}
          </button>
          {draftImageFile ? (
            <span className="max-w-[220px] truncate text-xs text-[var(--muted-foreground)]">
              {draftImageFile.name}
            </span>
          ) : null}
        </div>
        {resolvedImageUrl ? (
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]">
              <div className="relative h-full w-full">
                <Image
                  src={resolvedImageUrl}
                  alt={
                    draftName ||
                    t("paymentLinkCreate.paymentSettings.imageLabel")
                  }
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="100vw"
                />
            </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-4 border-t border-[var(--border)] pt-4">
        
        <div className="space-y-2">
          <div className="text-sm font-semibold text-[var(--foreground)]">
            {t("paymentLinkCreate.paymentSettings.amountLabel")}
            <span className="ml-1 text-danger">*</span>
          </div>
          <div className="flex items-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
            <span className="px-3 text-sm text-[var(--muted-foreground)]">
              $
            </span>
            <input
              type="number"
              value={draftAmount}
              onChange={(event) => onDraftAmountChange(event.target.value)}
              className="flex-1 bg-transparent px-2 py-2 text-sm text-[var(--foreground)] outline-none"
            />
            <select
              value={currentCurrency}
              onChange={(event) => onCurrentCurrencyChange(event.target.value as unknown as currencyType)}
              className="border-l border-[var(--border)] bg-transparent px-3 py-2 text-xs text-[var(--muted-foreground)]"
            >
              {currencyList.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

type DrawerPreviewProps = {
  previewQuantity: number;
  onPreviewQuantityChange: (value: number) => void;
  formattedAmount: string;
  formattedSubtotal: string;
};

const DrawerPreview = ({
  previewQuantity,
  onPreviewQuantityChange,
  formattedAmount,
  formattedSubtotal,
}: DrawerPreviewProps) => {
  const { t } = useTranslation();

  return (
    <div className="border-t border-[var(--border)] bg-[var(--surface-muted)] p-6 lg:w-[320px] lg:border-l lg:border-t-0">
      <div className="space-y-4">
        <div>
          <div className="text-sm font-semibold text-[var(--foreground)]">
            {t("paymentLinkCreate.preview.title")}
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            {t("paymentLinkCreate.paymentSettings.previewHelper")}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--foreground)]">
            {t("paymentLinkCreate.paymentSettings.unitQuantity")}
          </label>
          <input
            type="number"
            min={1}
            value={previewQuantity}
            onChange={(event) => {
              const parsed = Number.parseInt(event.target.value, 10);
              onPreviewQuantityChange(
                Number.isFinite(parsed) && parsed > 0 ? parsed : 1
              );
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
          />
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="text-xs text-[var(--muted-foreground)]">
            {previewQuantity} x ${formattedAmount} = ${formattedSubtotal}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-[var(--foreground)]">
              <span>{t("paymentLinkCreate.paymentSettings.total")}</span>
              <span>${formattedSubtotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type DrawerFooterProps = {
  onClose: () => void;
  primaryActionLabel: string;
  isSubmitting: boolean;
};

const DrawerFooter = ({
  onClose,
  primaryActionLabel,
  isSubmitting,
}: DrawerFooterProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] px-6 py-4">
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="rounded-lg cursor-pointer border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
      >
        {t("paymentLinkCreate.paymentSettings.cancelButton")}
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg cursor-pointer bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {primaryActionLabel}
      </button>
    </div>
  );
};
