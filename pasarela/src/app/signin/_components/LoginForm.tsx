'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { InputCustom } from '@/common/components';
import { formErrors } from '@/common/types/formErrors';
import { useFormValidation, ValidationSchema } from '@/common/hooks/useFormValidations';
import { AlertCircle, Loader2 } from 'lucide-react';
import { postUser } from '@/common/hooks/postUser';

interface Props{
    email:string,
    setEmail:(email:string)=>void,
    setStep:(step:'form' | 'verifyCode')=>void,
    password:string,
    setPassword:(password:string)=>void,
    setExpiresIn:(expiresIn:number)=>void
}

export function LoginForm({email,setEmail,setStep,password,setPassword, setExpiresIn}:Props){
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isVisible, setIsVisible] = useState(false);

  const { errors, validate } = useFormValidation<formErrors>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const rules: ValidationSchema<formErrors> = {
      email: { type: 'email', required: true },
      password: { type: 'password', required: true, strictPassword: false }
    };

    const isValid = validate({ email, password }, rules);

    if(isValid){
      const response = await postUser({email:email,password:password});

      if(response.success){
        setStep('verifyCode')
        setExpiresIn(response.data.expiresIn)
      }else{
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
    }
    setIsLoading(false);

  };

  return (
      <div 
        className={`
          relative z-20 w-full max-w-110 bg-background rounded-xl shadow-2xl p-8 sm:p-10 border border-surface-muted backdrop-blur-sm
          transform transition-all duration-700 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
      >
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t('login.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Mensaje de Error Global */}
          {error && (
            <div className="p-3 rounded-md bg-danger-surface border border-danger/20 text-danger text-sm flex items-center animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">

            <InputCustom
              label={t('login.emailLabel')}
              type={'email'}
              id='email'
              placeholder={t('login.emailPlaceholder')}
              action={(value) => setEmail(value as string)}
              tabIndex={1}
              error={errors && errors.email}
              value={email}
            />

          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                {t('login.passwordLabel')}
              </label>
              <Link 
                href="/forgot_password" 
                className="text-sm curosr-pointer text-accent hover:text-accent-hover font-medium transition-colors"
                tabIndex={3}
              >
                {t('login.forgotPassword')}
              </Link>
            </div>
            
            <InputCustom
              type={'password'}
              id='password'
              action={(value) => setPassword(value as string)}
              tabIndex={2}
              error={errors && errors.password}
              value={password}
            />

          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex cursor-pointer justify-center items-center h-10 rounded-full bg-accent hover:bg-accent-hover text-surface text-sm font-medium shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed"
            tabIndex={5}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              t('login.submitButton')
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm">
          <span className="text-muted-foreground mr-1">
            {t('login.footerText')}
          </span>
          <Link 
            href="/register" 
            className="font-medium cursor-pointer text-accent hover:text-accent-hover transition-colors"
            tabIndex={8}
          >
            {t('login.createAccount')}
          </Link>
        </div>

    </div>
  );
};