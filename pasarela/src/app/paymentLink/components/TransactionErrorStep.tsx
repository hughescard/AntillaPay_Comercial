import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

type TransactionErrorStepProps = {
  onRetry?: () => void;
  isDisabled?: boolean;
};

export const TransactionErrorStep = ({
  onRetry,
  isDisabled,
}: TransactionErrorStepProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-between gap-8 h-full">
      <div className="flex flex-col items-center text-center">
        <h4 className="flex items-center gap-3 text-base font-semibold text-danger">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-surface text-danger">
            <X size={18} />
          </div> 
          {t("invoiceLocalError.errorTitle")}
        </h4>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("invoiceLocalError.errorBody")}
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        disabled={isDisabled}
        className="w-full cursor-pointer rounded-lg bg-accent py-2 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {t("invoiceLocalError.retryAction")}
      </button>
    </div>
  );
};