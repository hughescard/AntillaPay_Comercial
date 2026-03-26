'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Loader2 } from 'lucide-react';
import { InputCustom } from '@/common/components'; 
import { countries } from '@/lib/countries';
import { useFormValidation, ValidationSchema } from '@/common/hooks/useFormValidations';
import { postUserRegister } from '../_hook/postUserRegister';

interface RegisterFormValues {
  email: string;
  fullName: string;
  password: string;
  repeatPassword: string;
  country: string;
  [key: string]: unknown;
}

interface Props {
    setExpiresIn: (value:number)=>void,
    setEmail:(email:string)=>void,
    setPassword:(password:string)=>void,
    setStep:(step:'form'|'verifyCode')=>void,
    email:string,
    password:string,
}

export const RegisterForm = ({setExpiresIn,setEmail,email,password,setPassword,setStep}:Props) => {
  const { t } = useTranslation();
  
  const [fullName, setFullName] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [country, setCountry] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState<string | null>(null)
  
  const [isVisible, setIsVisible] = useState(false);

  const { errors, validate } = useFormValidation<RegisterFormValues>();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const countryOptions = countries.map(c => ({
    value: c.code,
    label: c.name,
    flag: c.flag
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const values: RegisterFormValues = {
      email,
      fullName,
      password,
      repeatPassword,
      country
    };

    const rules: ValidationSchema<RegisterFormValues> = {
      email: { type: 'email', required: true },
      fullName: { type: 'name', required: true },
      password: { type: 'password', required: true, strictPassword: true }, 
      repeatPassword: { 
        type: 'confirmPassword', 
        required: true, 
        matchField: 'password' 
      },
      country: { type: 'select', required: true } 
    };

    const isValid = validate(values, rules);

    if (!isValid) {
      setIsLoading(false);
      return; 
    }

    const response = await postUserRegister({email:email,password:password,country:country});
    if(response.success){
        setExpiresIn(response.data.expiresIn);
        setStep('verifyCode');
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
    setIsLoading(false)
  };

  return (
    <div className="w-[90%] mx-auto lg:w-full order-1 lg:order-2 flex items-center justify-center">
      <div 
        className={`
          w-full max-w-110 bg-surface rounded-xl shadow-2xl p-8 border border-surface-muted backdrop-blur-sm
          transform transition-all duration-700 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
      >
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {t('register.title')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-danger-surface border border-danger/20 text-danger text-sm flex items-center animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          <InputCustom
            id="email"
            type="email"
            label={t('register.emailLabel')}
            placeholder={t('register.emailPlaceholder')}
            value={email}
            action={(val) => setEmail(val as string)}
            tabIndex={1}
            error={errors.email}
          />

          <InputCustom
            id="name"
            type="text"
            label={t('register.nameLabel')}
            value={fullName}
            action={(val) => setFullName(val as string)}
            tabIndex={2}
            error={errors.fullName}
          />

          <InputCustom
            id="password"
            type="password"
            label={t('register.passwordLabel')}
            value={password}
            action={(val) => setPassword(val as string)}
            tabIndex={3}
            error={errors.password}
          />

          <InputCustom
            id="repeatPassword"
            type="password"
            label={t('register.passwordRepeatLabel')}
            value={repeatPassword}
            action={(val) => setRepeatPassword(val as string)}
            tabIndex={4}
            error={errors.repeatPassword}
          />

          <InputCustom
            id="country"
            type="select" 
            label={t('register.countryLabel')}
            placeholder="Selecciona un país"
            value={country}
            action={(val) => setCountry(val as string)}
            options={countryOptions} 
            tabIndex={5}
            error={errors.country}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center h-10 rounded-full bg-accent hover:bg-accent-hover text-surface text-sm font-medium shadow-md transition-all mt-6 cursor-pointer"
            tabIndex={6}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('register.submitButton')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground mr-1">{t('register.footerText')}</span>
          <Link href="/signin" className="font-medium cursor-pointer text-accent hover:text-accent-hover transition-colors">
            {t('register.loginLink')}
          </Link>
        </div>

      </div>
    </div>
  );
};