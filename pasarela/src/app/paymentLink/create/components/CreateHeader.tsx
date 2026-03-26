import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

type CreateHeaderProps = {
  onCreatePaymentLink?: () => void;
  isCreating?: boolean;
  isDisabled?: boolean;
  error: boolean;
  titleError?: boolean;
  amountError?: boolean;
  urlErrors?: { successUrl: boolean; errorUrl: boolean };
};

export const CreateHeader = ({
  onCreatePaymentLink,
  isCreating = false,
  isDisabled = false,
  error,
  titleError = false,
  amountError = false,
  urlErrors = { successUrl: false, errorUrl: false },
}: CreateHeaderProps) => {
  const { t } = useTranslation();
  const isActionDisabled = isCreating || isDisabled;
  const hasUrlErrors = urlErrors.successUrl || urlErrors.errorUrl;
  const validationErrors = [
    titleError ? t("paymentLinkCreate.header.titleValidationError") : null,
    amountError ? t("paymentLinkCreate.header.amountValidationError") : null,
    hasUrlErrors ? t("paymentLinkCreate.header.urlValidationError") : null,
  ].filter(Boolean);

  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-6 py-4">
      <div className="flex items-center gap-3">
        <Link
          href="/paymentLink"
          className="flex h-7 w-7 items-center justify-center cursor-pointer text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
          aria-label={t("paymentLinkCreate.header.closeLabel")}
        >
          <X size={14} />
        </Link>
        <span className="h-4 w-px bg-[var(--border)]" />
        <h1 className="text-sm font-semibold text-[var(--foreground)]">
          {t("paymentLinkCreate.header.title")}
        </h1>
      </div>
      <div className="flex gap-3 items-center">
        {error && 
          <p className="mt-1 text-sm text-danger" role="alert">
              {t('forms.requestError')}
          </p>
        }
        {validationErrors.length > 0 && (
          <p className="mt-1 text-sm text-danger" role="alert">
            {t("paymentLinkCreate.header.validationErrorPrefix", {
              errors: validationErrors.join(" "),
            })}
          </p>
        )}
        <button
          type="button"
          onClick={onCreatePaymentLink}
          disabled={isActionDisabled}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] shadow-sm transition hover:opacity-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
        >
          {t("paymentLinkCreate.header.createButton")}
          <ChevronDown size={16} />
        </button>
      </div>  
      
    </div>
  );
};
