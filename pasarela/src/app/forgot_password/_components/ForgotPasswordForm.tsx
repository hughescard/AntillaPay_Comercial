'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { InputCustom } from '@/common/components';
import { useFormValidation, ValidationSchema } from '@/common/hooks/useFormValidations';
import { postForgotPassword } from '../_hooks/postForgotPassword';

interface Props {
  email: string;
  setEmail: (email: string) => void;
  setStep: (step: 'form' | 'verifyCode') => void;
  setExpiresIn: (time: number) => void;
}

export const ForgotPasswordForm = ({ email, setEmail, setStep, setExpiresIn }: Props) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { errors, validate } = useFormValidation<{ email: string }>();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const rules: ValidationSchema<{ email: string }> = {
      email: { type: 'email', required: true }
    };

    const isValid = validate({ email }, rules);

    if (isValid) {
      const response = await postForgotPassword({ email });

      if (response.success) {
        setExpiresIn(response.data.expiresIn || 900); 
        setIsVisible(false); 
        setTimeout(() => setStep('verifyCode'), 700);
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
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`
        relative z-20 w-full max-w-110 bg-background rounded-xl shadow-2xl p-8 sm:p-10 border border-surface-muted backdrop-blur-sm
        transform transition-all duration-700 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t('forgotPassword.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('forgotPassword.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-md bg-danger-surface border border-danger/20 text-danger text-sm flex items-center animate-in fade-in">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <InputCustom
          label={t('forgotPassword.emailLabel')}
          type="email"
          id="email"
          placeholder={t('forgotPassword.emailPlaceholder')}
          action={(val) => setEmail(val as string)}
          value={email}
          tabIndex={1}
          error={errors.email}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex cursor-pointer justify-center items-center h-10 rounded-full bg-accent hover:bg-accent-hover text-surface text-sm font-medium shadow-md transition-all mt-2"
          tabIndex={2}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('forgotPassword.submitButton')}
        </button>
      </form>

      <div className="mt-6 border-t border-divider pt-6 flex justify-center">
        <Link 
          href="/signin" 
          className="group cursor-pointer flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
          {t('forgotPassword.backToLogin')}
        </Link>
      </div>
    </div>
  );
};