/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Info, Loader2, X } from "lucide-react";
import { useModalShortcuts } from "@/common/hooks/useModalShortcuts"; 

interface NewTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableAmount: number; 
  onTransfer: (data: { businessEmail: string, amount: number }) => Promise<{ success: boolean; message?: string }>;
}

export const NewTransferModal = ({ isOpen, onClose, availableAmount = 999999999, onTransfer }: NewTransferModalProps) => {
  const { t } = useTranslation();
  
  const [email, setEmail] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isAmountValid = Number(amount) > 0 && Number(amount) <= availableAmount;

  const isFormValid = !loading && isEmailValid && isAmountValid;

  const handleTransfer = async () => {
     if (!isFormValid) return;

     setLoading(true);
     setError('');

      try {
        const response = await onTransfer({ businessEmail: email, amount: Number(amount) });
        
        if(response.success){
          handleClose();
        } else {
          const normalizedMessage = (response.message ?? '').toLowerCase().trim();
          if (
            normalizedMessage === 'invalid_email' ||
            normalizedMessage === '"invalid_email"' ||
            normalizedMessage.includes('invalid_email') ||
            normalizedMessage.includes('invalid email')
          ) {
            setError(t('validations.invalid_email'));
          } else {
            setError(t('modals.transfer.error_message'));
          }
        }
      } catch (err) {
        console.error(err);
        setError(t('modals.transfer.unexpected_error'));
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAmount('');
      setEmail('');
      setError('');
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (loading) return;
    setIsVisible(false); 
    const timer = setTimeout(() => {
      onClose();
    }, 200); 
    return () => clearTimeout(timer);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
        setAmount(value);
    }
  }

  useModalShortcuts(
    isOpen,       
    handleClose,  
    handleTransfer,    
    isFormValid 
  );

  if (!isOpen) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center 
        bg-black/50 backdrop-blur-sm p-4
        transition-opacity duration-200 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div 
        className={`
          bg-surface w-full max-w-lg rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden
          transform transition-all duration-200 ease-in-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-2">
            <div>
                <h3 className="text-xl font-bold text-foreground">{t('modals.transfer.title')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t('modals.transfer.description')}</p>
            </div>
          <button onClick={handleClose} disabled={loading} className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Input Correo */}
          <div>
            <label className="block text-sm font-bold mb-2 text-foreground">
                {t('modals.transfer.email_label')}
            </label>
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@correo.com"
                className={`
                    w-full px-4 py-2.5 rounded-lg border bg-surface text-foreground outline-none transition-all placeholder:text-muted-foreground
                    ${email && !isEmailValid ? 'border-danger focus:ring-danger/20' : 'border-border focus:ring-2 focus:ring-accent/50'}
                `}
            />
            {email && !isEmailValid && (
                <p className="text-xs text-danger mt-1">{t('validations.invalid_email')}</p>
            )}
          </div>

          {/* Input Monto */}
          <div>
            <label className="block text-sm font-bold mb-2 text-foreground">
                {t('modals.transfer.amount_label')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground font-semibold">$</span>
              <input 
                type="number" 
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-border bg-surface text-foreground focus:ring-2 focus:ring-accent/50 outline-none transition-all placeholder:text-muted-foreground"
              />
            </div>
           <p className="text-xs text-muted-foreground mt-1">
              {t('modals.withdraw.max_available', { amount: availableAmount.toFixed(2) })}
            </p>
          </div>

          {/* Info Box (Cajita gris de la imagen) */}
          <div className="p-4 bg-surface-muted/50 rounded-lg border border-border/50 text-sm text-muted-foreground">
             {t('modals.transfer.info_text')}
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 pt-2 flex items-center justify-between mt-auto">
          {/* Mensaje de error a la izquierda */}
          <div className="max-w-[60%] mr-4">
              {error && (
                <div className="flex items-center gap-2 text-xs text-danger animate-pulse">
                    <Info size={14} className="shrink-0" />
                    <span>{error}</span>
                </div>
              )}
          </div>
           
           {/* Botones de acción */}
           <div className="flex gap-3 ml-auto">
                <button 
                    onClick={handleClose}
                    disabled={loading}
                    className="px-4 py-2.5 border border-border text-foreground hover:bg-surface-hover rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                    {t('common.cancel')}
                </button>

                <button 
                    onClick={handleTransfer} 
                    disabled={!isFormValid} 
                    className={`
                        flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium shadow-sm transition-colors disabled:cursor-default cursor-pointer 
                        ${!isFormValid && 'opacity-50 cursor-not-allowed'}
                    `}
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {t('modals.transfer.confirm_button')}
                </button>
           </div>
        </div>
      </div>
    </div>
  );
};
