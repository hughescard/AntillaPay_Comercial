import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AntillaLoginStep } from "./AntillaLoginStep";
import { AntillaVerifyStep } from "./AntillaVerifyStep";
import type {
  AntillaLoginSuccessPayload,
  AntillaStep,
  PaymentPreviewPayParams,
} from "./paymentPreview.types";

type AntillaPaymentStepProps = {
  antillaStep: AntillaStep;
  isDisabled: boolean;
  onNextStep: () => void;
  onPay?: (params?: PaymentPreviewPayParams) => void;
};

export const AntillaPaymentStep = ({
  antillaStep,
  isDisabled,
  onNextStep,
  onPay,
}: AntillaPaymentStepProps) => {
  const { t } = useTranslation();
  const [authData, setAuthData] = useState<AntillaLoginSuccessPayload>({
    email: "",
    password: "",
    expiresIn: 0,
  });

  return (
    <div className="space-y-3 rounded-xl border border-border bg-background p-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-semibold text-accent-foreground">
          A
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {antillaStep === "login"
              ? t("paymentLinkCreate.preview.antillaLoginTitle")
              : t("paymentLinkCreate.preview.antillaVerifyTitle")}
          </p>
          <p className="text-xs text-muted-foreground">
            {antillaStep === "login"
              ? t("paymentLinkCreate.preview.antillaLoginSubtitle")
              : t("paymentLinkCreate.preview.antillaVerifySubtitle")}
          </p>
        </div>
      </div>

      {antillaStep === "login" ? (
        <AntillaLoginStep
          isDisabled={isDisabled}
          onLoginSuccess={setAuthData}
          onNext={onNextStep}
        />
      ) : (
        <AntillaVerifyStep
          isDisabled={isDisabled}
          email={authData.email}
          password={authData.password}
          expiresIn={authData.expiresIn}
          onPay={onPay}
        />
      )}
    </div>
  );
};
