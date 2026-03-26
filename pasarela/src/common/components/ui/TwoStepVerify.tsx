'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react'; 
import { InputCustom } from '@/common/components'; 
import { postVerifyCode } from '@/common/hooks/postVerifyCode';
import { postUser } from '@/common/hooks/postUser';
import { useAuth } from '@/common/context/authContext';

const RESEND_COOLDOWN = 60; 

interface Props {
    userEmail: string;
    setStep:(step:'form' | 'verifyCode')=>void,
    password:string,
    expires_in:number
}

export const TwoStepVerifyPage = ({userEmail,setStep, password, expires_in}: Props) => {
  const { t } = useTranslation();
  const {getMyInfo} = useAuth();
  const router = useRouter();

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [expirationTimer, setExpirationTimer] = useState(expires_in);
  const [canResend, setCanResend] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (expirationTimer > 0) {
      interval = setInterval(() => {
        setExpirationTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [expirationTimer]);

  const formatExpiration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { m, s };
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    
    const response = await postUser({email:userEmail, password:password});

    if(response.success){
        setResendTimer(RESEND_COOLDOWN);
        setExpirationTimer(response.data.expires_in);
        setCanResend(false);
        setError(null);
        setOtp(''); 
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const response = await postVerifyCode({email:userEmail,code:otp});
    if(response.success){
        setIsLoading(true);
        localStorage.setItem('authToken',response.data.token);
        getMyInfo();
        router.push('/');
    }else{
        setIsLoading(false);
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
                | 'invalid_code'
                | 'code_expired'
            }`
          )
        );
    }
  };

  const { m: expM, s: expS } = formatExpiration(expirationTimer);

  return (
    <div 
        className={`
            relative z-20 w-full max-w-110 bg-background rounded-xl shadow-2xl p-8 sm:p-10 border border-surface-muted backdrop-blur-sm
            transform transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
    >
    
        {/* Header */}
        <div className="mb-7">
            <h1 className="text-2xl font-bold text-foreground mb-2">
            {t('twoStep.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
            {t('twoStep.description')} <span className="font-medium text-foreground">{userEmail}</span>
            </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Banner */}
            {error && (
            <div className="p-3 rounded-md bg-danger-surface border border-danger/20 text-danger text-sm flex items-center animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
            </div>
            )}

            {/* OTP Input */}
            <div className="space-y-1.5">
            <InputCustom
                label={t('twoStep.codeLabel')}
                type="text"
                id="otp"
                placeholder={t('twoStep.codePlaceholder')}
                action={(val) => setOtp(val as string)}
                value={otp}
                maxLength={6} 
                tabIndex={1}
            />
            
            {/* Timer de Expiración */}
            <div className="text-xs text-muted-foreground mt-1 text-right">
                {t('twoStep.expirationTimer', { minutes: expM, seconds: expS })}
            </div>
            </div>

            {/* Botón Verificar */}
            <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="w-full flex cursor-pointer justify-center items-center h-10 rounded-full bg-accent hover:bg-accent-hover text-surface text-sm font-medium shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed"
            tabIndex={2}
            >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                t('twoStep.verifyButton')
            )}
            </button>

            {/* Sección Reenviar */}
            <div className="text-center">
            {canResend ? (
                <button
                type="button"
                onClick={handleResend}
                className="text-sm font-medium text-accent hover:text-accent-hover hover:underline transition-colors focus:outline-none"
                tabIndex={3}
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

        {/* Separador */}
        <div className="my-4 border-t border-divider"></div>

        {/* Botón Atrás */}
        <div className="flex justify-center">
            <button 
                className="group flex cursor-pointer items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={4}
                onClick={() => setStep('form')}
            >
            <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
            {t('twoStep.backButton')}
            </button>
        </div>

    </div>
  );
}