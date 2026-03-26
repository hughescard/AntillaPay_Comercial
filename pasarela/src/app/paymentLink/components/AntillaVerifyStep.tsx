import { useEffect, useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { postVerifyCode } from "@/common/hooks/postVerifyCode";
import { postUser } from "@/common/hooks/postUser";
import type { PaymentPreviewPayParams } from "./paymentPreview.types";

const RESEND_COOLDOWN = 60;

type AntillaVerifyStepProps = {
  isDisabled: boolean;
  email: string;
  password: string;
  expiresIn: number;
  onPay?: (params?: PaymentPreviewPayParams) => void;
};

export const AntillaVerifyStep = ({
  isDisabled,
  email,
  password,
  expiresIn,
  onPay,
}: AntillaVerifyStepProps) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [expirationTimer, setExpirationTimer] = useState(expiresIn);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    setExpirationTimer(expiresIn);
  }, [expiresIn]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (expirationTimer > 0) {
      interval = setInterval(() => {
        setExpirationTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [expirationTimer]);

  const formatExpiration = useMemo(() => {
    const minutes = Math.floor(expirationTimer / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (expirationTimer % 60).toString().padStart(2, "0");
    return { minutes, seconds };
  }, [expirationTimer]);

  const handleVerify = async () => {
    if (otp.length < 6 || isDisabled) return;

    setIsLoading(true);
    setError(null);

    const response = await postVerifyCode({ email, code: otp });

    if (response.success) {
      const token =
        typeof response.data?.token === "string" ? response.data.token : null;

      if (!token) {
        setError(t("errors.unknown_error"));
        setIsLoading(false);
        return;
      }

      localStorage.setItem("authToken", token);
      onPay?.({ selectedMethod: "wallet" });
      setIsLoading(false);
      return;
    }

    setError(
      t(
        `errors.${
          response.data as
            | "invalid_credentials"
            | "network_error"
            | "field_required"
            | "required"
            | "invalid_email"
            | "weak_password"
            | "invalid_bank_account"
            | "invalid_phone"
            | "invalid_name"
            | "invalid_format"
            | "unknown_error"
            | "invalid_code"
            | "code_expired"
        }`
      )
    );
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (!canResend || isDisabled) return;

    const response = await postUser({ email, password });

    if (response.success) {
      const nextExpiresIn =
        typeof response.data?.expiresIn === "number"
          ? response.data.expiresIn
          : typeof response.data?.expires_in === "number"
            ? response.data.expires_in
            : 0;

      setResendTimer(RESEND_COOLDOWN);
      setExpirationTimer(nextExpiresIn);
      setCanResend(false);
      setError(null);
      setOtp("");
      return;
    }

    setError(
      t(
        `errors.${
          response.data as
            | "invalid_credentials"
            | "network_error"
            | "field_required"
            | "required"
            | "invalid_email"
            | "weak_password"
            | "invalid_bank_account"
            | "invalid_phone"
            | "invalid_name"
            | "invalid_format"
            | "unknown_error"
        }`
      )
    );
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">
          {t("paymentLinkCreate.preview.antillaVerifyLabel")}
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-[#fff7d6] px-3 py-2 text-xs text-foreground">
          <Lock size={14} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="••••••"
            className="w-full bg-transparent outline-none"
            disabled={isDisabled || isLoading}
            value={otp}
            maxLength={6}
            onChange={(event) => setOtp(event.target.value)}
          />
        </div>
        <div className="text-[10px] text-muted-foreground text-right">
          {t("twoStep.expirationTimer", {
            minutes: formatExpiration.minutes,
            seconds: formatExpiration.seconds,
          })}
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleVerify}
        disabled={isDisabled || isLoading || otp.length < 6}
        className="w-full cursor-pointer rounded-lg bg-surface-muted py-2 text-sm font-semibold text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {t("paymentLinkCreate.preview.antillaVerifyAction")}
      </button>

      <div className="text-center">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm font-medium text-accent transition-colors hover:underline"
          >
            {t("twoStep.resendButton")}
          </button>
        ) : (
          <span className="text-sm text-muted-foreground">
            {t("twoStep.resendTimer", { seconds: resendTimer })}
          </span>
        )}
      </div>
    </div>
  );
};
