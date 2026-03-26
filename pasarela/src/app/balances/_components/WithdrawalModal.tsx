/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check, CreditCard, Info, Loader2, Plus, X } from "lucide-react";
import { bankAccount } from "@/common/types/bankAccount";
import { useModalShortcuts } from "@/common/hooks/useModalShortcuts";
import { useAuth } from "@/common/context/authContext";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableAmount: number;
  banks: bankAccount[];
  onAddAccount: () => void;
  canAddAccount?: boolean;
  canConfirm?: boolean;
  onConfirm:(data:{amount:number,accountId:string})=>Promise<{success:boolean}>
}

export const WithdrawalModal = ({ isOpen, onClose, availableAmount, banks, onAddAccount, canAddAccount = true, canConfirm = true, onConfirm }: WithdrawalModalProps) => {
  const { t } = useTranslation();
  const {getMyInfo} = useAuth()
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string>('')

  const [isVisible, setIsVisible] = useState(false);

  const isFormValid = canConfirm && !loading && selectedBank !== '' && Number(amount) > 0;


  const onExtract = async () =>{
     setLoading(true);
      try {
        if (!canConfirm) {
          setError('Tu rol no tiene permiso para retirar fondos.');
          return;
        }
        const response = await onConfirm({ amount:Number(amount), accountId:selectedBank });
        if(response.success){
        await getMyInfo();
        handleClose();
        setError('');
        }else{
          setError(t('modals.withdraw.error_message'))
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
  }

   


  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAmount('');
      setError('');
      setSelectedBank('');
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false); 
    const timer = setTimeout(() => {
      onClose();
    }, 200); 
    return () => clearTimeout(timer);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      if(Number(value) <= availableAmount){
        setAmount(value);
      }
    }
  }

  useModalShortcuts(
    isOpen,       
    handleClose,  
    onExtract,    
    isFormValid,
    !loading
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
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-xl font-bold text-foreground">{t('modals.withdraw.title')}</h3>
          <button onClick={handleClose} disabled={loading} className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar max-h-[70vh]">
          {/* Input Importe */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">{t('modals.withdraw.amount_label')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground font-semibold">US$</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => handleInputChange(e)}
                placeholder="0.00"
                className="w-full pl-12 pr-24 py-2.5 rounded-lg border border-border bg-surface text-foreground focus:ring-2 focus:ring-accent/50 outline-none transition-all placeholder:text-muted-foreground"
              />
              <button 
                onClick={() => setAmount(availableAmount.toString())}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-accent hover:text-accent-hover uppercase cursor-pointer"
              >
                {t('modals.withdraw.use_max')}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('modals.withdraw.max_available', { amount: availableAmount.toFixed(2) })}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">{t('modals.withdraw.send_to')}</label>
            
            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {banks.length > 0 && banks.map((bank) => (
                <div 
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={`
                    flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer
                    ${selectedBank === bank.id 
                      ? 'border-accent ring-1 ring-accent bg-accent/5' 
                      : 'border-border hover:border-accent/50 bg-surface'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center text-muted-foreground">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{bank.bank}</p>
                      <p className="text-xs text-muted-foreground">{bank.accountNumber}</p>
                    </div>
                  </div>
                  {selectedBank === bank.id && (
                    <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-white">
                      <Check size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => onAddAccount()}
              disabled={!canAddAccount}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-border text-accent hover:bg-accent/5 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={16} />
              {t('modals.withdraw.add_account')}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-surface-muted/30 border-t border-border flex items-center justify-between mt-auto">
          <div className="max-w-[60%]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground ">
                <Info size={14} className="shrink-0" />
                <span>{t('modals.withdraw.info')}</span>
              </div>
              <p className="mt-1 text-sm text-danger" role="alert">
                {error}
              </p>
          </div>
           
           <button onClick={()=>onExtract()} disabled={!canConfirm || loading || selectedBank == '' || Number(amount) <= 0} 
           className={`flex item-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm 
           font-medium shadow-sm transition-colors cursor-pointer ${(selectedBank == '' || Number(amount) <= 0) && 'opacity-50'}`}>
             {loading && <Loader2 size={16} className="animate-spin" />}
             {t('modals.withdraw.confirm_button')}
           </button>
        </div>
      </div>
    </div>
  );
};
