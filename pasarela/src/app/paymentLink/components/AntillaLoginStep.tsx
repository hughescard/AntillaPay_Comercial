import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { postUser } from "@/common/hooks/postUser";
import { validateFormsFields } from "@/lib/validateFormsFields";
import type {
  AntillaLoginSuccessPayload,
  FormError,
} from "./paymentPreview.types";

type AntillaLoginStepProps = {
  isDisabled: boolean;
  onLoginSuccess: (payload: AntillaLoginSuccessPayload) => void;
  onNext: () => void;
};

export const AntillaLoginStep = ({
  isDisabled,
  onLoginSuccess,
  onNext,
}: AntillaLoginStepProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: FormError;
    password?: FormError;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleNext = async () => {
    const validation = validateFormsFields(
      {
        email,
        password,
      },
      {
        requiredErrorId: "errors.required",
        invalidEmailErrorId: "errors.invalid_email",
      }
    );

    if (validation.email || validation.password) {
      setFieldErrors({
        email: validation.email,
        password: validation.password,
      });
      return;
    }

    setFieldErrors({});
    setGeneralError(null);
    setIsLoading(true);

    const response = await postUser({ email, password });

    if (response.success) {
      const expiresInValue =
        typeof response.data?.expiresIn === "number"
          ? response.data.expiresIn
          : 0;
      onLoginSuccess({
        email,
        password,
        expiresIn: expiresInValue,
      });
      onNext();
      setIsLoading(false);
      return;
    }

    setGeneralError(
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
    setIsLoading(false);
  };

  const handleEnterKey = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (isDisabled || isLoading) return;
    await handleNext();
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">
          {t("paymentLinkCreate.preview.antillaUserLabel")}
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-[#fff7d6] px-3 py-2 text-xs text-foreground">
          <User size={14} className="text-muted-foreground" />
          <input
            type="text"
            placeholder={t("paymentLinkCreate.preview.antillaUserPlaceholder")}
            className="w-full bg-transparent outline-none"
            disabled={isDisabled}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={handleEnterKey}
          />
        </div>
        {fieldErrors.email ? (
          <p className="text-xs text-danger">{t(fieldErrors.email.id)}</p>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">
          {t("paymentLinkCreate.preview.antillaPasswordLabel")}
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-[#fff7d6] px-3 py-2 text-xs text-foreground">
          <Lock size={14} className="text-muted-foreground" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-transparent outline-none"
            disabled={isDisabled}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={handleEnterKey}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isDisabled}
            className="cursor-pointer text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
            aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {fieldErrors.password ? (
          <p className="text-xs text-danger">{t(fieldErrors.password.id)}</p>
        ) : null}
      </div>

      {generalError ? (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          {generalError}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleNext}
        disabled={isDisabled || isLoading}
        className="w-full cursor-pointer rounded-lg bg-accent py-2 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading
          ? t("paymentLinkCreate.preview.processingPayAction")
          : t("paymentLinkCreate.preview.antillaNextAction")}
      </button>
    </div>
  );
};
