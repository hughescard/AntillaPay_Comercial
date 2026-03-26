import { useTranslation } from "react-i18next";

type AfterPaymentSettingsProps = {
  showConfirmation: boolean;
  onShowConfirmationChange: (value: boolean) => void;
  replaceMessageEnabled: boolean;
  replaceMessage: string;
  onReplaceMessageEnabledChange: (value: boolean) => void;
  onReplaceMessageChange: (value: string) => void;
  generatePDF: boolean;
  onGeneratePDFChange: (value: boolean) => void;
  successURL: string;
  errorURL: string;
  onSuccessURLChange: (value: string) => void;
  onErrorURLChange: (value: string) => void;
  urlErrors: {successUrl:boolean,errorUrl:boolean}
};

export const AfterPaymentSettings = ({
  showConfirmation,
  onShowConfirmationChange,
  replaceMessageEnabled,
  replaceMessage,
  onReplaceMessageEnabledChange,
  onReplaceMessageChange,
  generatePDF,
  onGeneratePDFChange,
  successURL,
  errorURL,
  onSuccessURLChange,
  onErrorURLChange,
  urlErrors
}: AfterPaymentSettingsProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          {t("paymentLinkCreate.afterPaymentSettings.confirmTitle")}
        </h3>
        <label className="flex items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            name="confirm"
            checked={showConfirmation}
            onChange={(event) => onShowConfirmationChange(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border accent-accent"
          />
          {t("paymentLinkCreate.afterPaymentSettings.showConfirmation")}
        </label>
        {showConfirmation ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">
                {t("paymentLinkCreate.afterPaymentSettings.successUrlLabel")}
                <span className="ml-1 text-danger">*</span>
              </div>
              <input
                type="url"
                value={successURL}
                onChange={(event) => onSuccessURLChange(event.target.value)}
                placeholder={t(
                  "paymentLinkCreate.afterPaymentSettings.successUrlPlaceholder"
                )}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
              />
              {urlErrors.successUrl && 
                <p className="mt-1 text-sm text-danger" role="alert">
                    {t('forms.urlInvalid')}
                </p>
              }
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-[var(--foreground)]">
                {t("paymentLinkCreate.afterPaymentSettings.errorUrlLabel")}
              </div>
              <input
                type="url"
                value={errorURL}
                onChange={(event) => onErrorURLChange(event.target.value)}
                placeholder={t(
                  "paymentLinkCreate.afterPaymentSettings.errorUrlPlaceholder"
                )}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
              />
              {urlErrors.errorUrl && 
                <p className="mt-1 text-sm text-danger" role="alert">
                    {t('forms.urlInvalid')}
                </p>
              }
            </div>
          </div>
        ) : <>
        <label className="flex items-start gap-3 text-sm text-[var(--muted-foreground)]">
          <input
            type="checkbox"
            checked={replaceMessageEnabled}
            onChange={(event) =>
              onReplaceMessageEnabledChange(event.target.checked)
            }
            className="mt-1 h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
          />
          {t("paymentLinkCreate.afterPaymentSettings.replaceMessage")}
        </label>
        {replaceMessageEnabled ? (
          <textarea
            rows={3}
            value={replaceMessage}
            onChange={(event) => onReplaceMessageChange(event.target.value)}
            placeholder={t(
              "paymentLinkCreate.afterPaymentSettings.replaceMessagePlaceholder"
            )}
            className="w-full placeholder:text-gray-400 resize-none rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
          />
        ) : null}
        </>}
        
      </div>

      <div className="space-y-3 border-t border-[var(--border)] pt-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          {t("paymentLinkCreate.afterPaymentSettings.invoiceTitle")}
        </h3>
        <label className="flex items-start gap-3 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={generatePDF}
            onChange={(event) => onGeneratePDFChange(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
          />
          {t("paymentLinkCreate.afterPaymentSettings.invoiceToggle")}
        </label>
        <p className="text-xs text-muted-foreground">
          {t("paymentLinkCreate.afterPaymentSettings.invoiceHelp")}
        </p>
      </div>
    </div>
  );
};
