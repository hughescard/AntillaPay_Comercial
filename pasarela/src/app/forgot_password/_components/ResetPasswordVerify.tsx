'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { InputCustom } from '@/common/components';
import { useFormValidation, ValidationSchema } from '@/common/hooks/useFormValidations';
import { postForgotPassword } from '../_hooks/postForgotPassword';
import { puttResetPassword } from '../_hooks/postResetPassword';

const RESEND_COOLDOWN = 60;

interface Props {
  userEmail: string;
  setStep: (step: 'form' | 'verifyCode') => void;
  expires_in: number;
}

interface ResetFormValues {
  password: string;
  confirmPassword: string;
  [key:string]:unknown
}

export const ResetPasswordVerify = ({ userEmail, setStep, expires_in }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [expirationTimer, setExpirationTimer] = useState(expires_in);
  const [canResend, setCanResend] = useState(false);

  const { errors, validate } = useFormValidation<ResetFormValues>();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (expirationTimer > 0) {
      interval = setInterval(() => setExpirationTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [expirationTimer]);

  const handleResend = async () => {
    if (!canResend) return;
    const response = await postForgotPassword({ email: userEmail }); 

    if (response.success) {
      setResendTimer(RESEND_COOLDOWN);
      setExpirationTimer(response.data.expires_in || 900);
      setCanResend(false);
      setError(null);
      setOtp('');
    } else {
      setError(
          t(
            `errors.${
              response.data as
                | 'invalid_credentials'
                | 'network_error'
                | 'field_required'
                | 'required'
                | 'invalid_email'
                | 'weak_password'
                | 'invalid_bank_account'
                | 'invalid_phone'
                | 'invalid_name'
                | 'invalid_format'
                | 'unknown_error'
            }`
          )
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (otp.length < 6) {
      setError(t('errors.invalid_code'));
      setIsLoading(false);
      return;
    }

    const rules: ValidationSchema<ResetFormValues> = {
      password: { type: 'password', required: true, strictPassword: true },
      confirmPassword: { type: 'confirmPassword', required: true, matchField: 'password' }
    };

    const isValid = validate({ password, confirmPassword }, rules);

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    const response = await puttResetPassword({ 
      email: userEmail, 
      code: otp, 
      newPassword: password 
    });

    if (response.success) {
      router.push('/signin');
    } else {
      setError(
          t(
            `errors.${
              response.data as
                | 'invalid_credentials'
                | 'network_error'
                | 'field_required'
                | 'required'
                | 'invalid_email'
                | 'weak_password'
                | 'invalid_bank_account'
                | 'invalid_phone'
                | 'invalid_name'
                | 'invalid_format'
                | 'unknown_error'
            }`
          )
        );
      setIsLoading(false);
    }
  };

  const formatExpiration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { m, s };
  };

  const { m: expM, s: expS } = formatExpiration(expirationTimer);

  return (
    <div 
      className={`
        relative z-20 w-full max-w-110 bg-background rounded-xl shadow-2xl p-8 sm:p-10 border border-surface-muted backdrop-blur-sm
        transform transition-all duration-700 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t('forgotPassword.verifyTitle')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('forgotPassword.verifyDescription')} <span className="font-medium text-foreground">{userEmail}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-md bg-danger-surface border border-danger/20 text-danger text-sm flex items-center animate-in fade-in">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {/* OTP Input */}
        <div className="space-y-1">
          <InputCustom
            label={t('forgotPassword.codeLabel')}
            type="text"
            id="otp"
            placeholder={t('forgotPassword.codePlaceholder')}
            action={(val) => setOtp(val as string)}
            value={otp}
            maxLength={6}
            tabIndex={1}
          />
          <div className="text-xs text-muted-foreground text-right">
            {t('twoStep.expirationTimer', { minutes: expM, seconds: expS })}
          </div>
        </div>

        {/* Nuevas Contraseñas */}
        <InputCustom
          label={t('forgotPassword.newPasswordLabel')}
          type="password"
          id="password"
          action={(val) => setPassword(val as string)}
          value={password}
          tabIndex={2}
          error={errors.password}
        />

        <InputCustom
          label={t('forgotPassword.confirmPasswordLabel')}
          type="password"
          id="confirmPassword"
          action={(val) => setConfirmPassword(val as string)}
          value={confirmPassword}
          tabIndex={3}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer flex justify-center items-center h-10 rounded-full bg-accent hover:bg-accent-hover text-surface text-sm font-medium shadow-md transition-all mt-4"
          tabIndex={4}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('forgotPassword.changePasswordButton')}
        </button>

        {/* Reenviar */}
        <div className="text-center pt-2">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm cursor-pointer font-medium text-accent hover:text-accent-hover hover:underline transition-colors"
            >
              {t('twoStep.resendButton')}
            </button>
          ) : (
            <span className="text-sm text-muted-foreground">
              {t('twoStep.resendTimer', { seconds: resendTimer })}
            </span>
          )}
        </div>
      </form>

      {/* Atrás */}
      <div className="my-6 border-t border-divider"></div>
      <div className="flex justify-center">
        <button 
          className="group flex cursor-pointer items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => setStep('form'), 700);
          }}
        >
          <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
          {t('twoStep.backButton')}
        </button>
      </div>
    </div>
  );
};