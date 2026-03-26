/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { X, Loader2 } from "lucide-react";
import { InputCustom } from "@/common/components/ui/InputCustom"; 
import { SelectOption } from "@/common/components/ui/SearchableTable";
import { banks } from "@/lib/banks";
import { sanitizeTextInput } from "@/lib/profileValidations";
import { useModalShortcuts } from "@/common/hooks/useModalShortcuts";

interface AddBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { bankName:string,accountNumber:string,currency:string,representativeId:string,representativeName:string }) => Promise<void>; 
}

export const AddBankAccountModal = ({ isOpen, onClose, onSave }: AddBankAccountModalProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [bank, setBank] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [representativeId, setRepresentativeId] = useState<string>('');
  const [representativeName, setRepresentativeName] = useState<string>('');
  const [posibleCurrencies,setPosibleCurrencies] = useState<SelectOption[]>([])
  const [currency, setCurrency] = useState<string>('');
  
  const [errors, setErrors] = useState({ bank: '', account: '', currency: '', representativeId: '', representativeName: '' });

  const bankOptions = banks;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setBank('');
      setAccount('');
      setCurrency('');
      setRepresentativeId('');
      setRepresentativeName('');
      setPosibleCurrencies([]);
      setErrors({ bank: '', account: '', currency: '', representativeId: '', representativeName: '' });
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

  const handleAccountChange = (value: string | number) => {
    const val = value.toString().replace(/\D/g, ''); 
    let formatted = '';
    
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += val[i];
    }
    
    if (formatted.length <= 19) {
      setAccount(formatted);
      if (errors.account) setErrors({ ...errors, account: '' });
    }
  };

  const handleIdChange = (value: string) => {

    const cleanValue = value.replace(/[^a-zA-Z0-9-]/g, '');

    setRepresentativeId(cleanValue);
    
  };

  const handleRepresentativeNameChange = (value: string) => {
    const cleanValue = sanitizeTextInput(value);
    setRepresentativeName(cleanValue);
  }

  const handleCurrencyChange = (value: string | number) => {
    setCurrency(value as string)
    if (errors.currency) setErrors({ ...errors, currency: '' });
  }

  const handleBankChange = (value: string | number) => {
    setBank(value.toString());
    
    setCurrency('');
    setPosibleCurrencies([]);
    
    const selectedBankData = bankOptions.filter((item)=>item.value == value)[0];
    
    if(selectedBankData && selectedBankData.currency.length > 1){
        setPosibleCurrencies(selectedBankData.currency)
    } else if (selectedBankData) {
        setCurrency(selectedBankData.currency[0].value)
    }

    setErrors(prev => ({ ...prev, bank: '', currency: '' }));
  };

  const handleSubmit = async (e?: FormEvent) => {
    if(e) e.preventDefault();
    
    const newErrors = { bank: '', account: '', currency: '', representativeId: '', representativeName: '' };
    let isValid = true;

    if (!bank) {
      newErrors.bank = t('modals.add_account.error_bank');
      isValid = false;
    }

    if (posibleCurrencies.length > 1 && !currency) {
      newErrors.currency = t('modals.add_account.error_currency'); 
      isValid = false;
    }

    const accountRegex = /^\d{4} \d{4} \d{4} \d{4}$/;
    if (!accountRegex.test(account)) {
      newErrors.account = t('modals.add_account.error_account');
      isValid = false;
    }


    const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
    
    if (!representativeName || !representativeName.trim()) {
       newErrors.representativeName = t('validations.required'); 
       isValid = false;
    } else if (!nameRegex.test(representativeName)) {
       newErrors.representativeName = t('modals.add_account.error_name_format');
       isValid = false;
    }

    const idRegex = /^[a-zA-Z0-9-]+$/;

    if (!representativeId || !representativeId.trim()) {
       newErrors.representativeId = t('validations.required');
       isValid = false;
    } else if (!idRegex.test(representativeId)) {
       newErrors.representativeId = t('modals.add_account.error_id_format');
       isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setLoading(true);
      try {
        await onSave({ bankName:bank, accountNumber:account, currency: currency, representativeId, representativeName });
        handleClose();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useModalShortcuts(
    isOpen,       
    handleClose,  
    handleSubmit    
  );

  if (!isOpen) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center 
        bg-black/80 p-4
        transition-opacity duration-200 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div 
        className={`
          bg-surface w-full max-w-md rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden
          transform transition-all duration-200 ease-in-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-2">
          <div>
             <h3 className="text-xl font-bold text-foreground mb-2">{t('modals.add_account.title')}</h3>
             <p className="text-sm text-muted-foreground">{t('modals.add_account.description')}</p>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="p-6 space-y-5">
                
                {/* Select Banco */}
                <InputCustom
                    id="bank-select"
                    type="select"
                    label={t('modals.add_account.bank_label')}
                    placeholder={t('modals.add_account.bank_placeholder')}
                    value={bank}
                    action={handleBankChange}
                    options={bankOptions}
                    error={errors.bank}
                    tabIndex={1}
                />

                {/* Select Currency Condicional */}
                {posibleCurrencies.length > 1 &&
                <InputCustom
                    id="currency-select"
                    type="select"
                    label={t('modals.add_account.currency_label')}
                    placeholder={t('modals.add_account.currency_placeholder')}
                    value={currency}
                    action={handleCurrencyChange}
                    options={posibleCurrencies}
                    error={errors.currency}
                    tabIndex={2}
                />
                }

                {/* Input Cuenta */}
                <InputCustom
                    id="account-input"
                    type="text"
                    label={t('modals.add_account.account_label')}
                    placeholder={t('modals.add_account.account_placeholder')}
                    value={account}
                    action={handleAccountChange}
                    error={errors.account}
                    maxLength={19}
                    tabIndex={3}
                />

                {/* Input Id */}
                <InputCustom
                    id="id-input"
                    type="text"
                    label={t('modals.add_account.representativeIdLabel')}
                    placeholder={t('modals.add_account.representativeIdPlaceholder')}
                    value={representativeId}
                    action={(value) => handleIdChange(value as string)}
                    error={errors.representativeId}
                    maxLength={19}
                    tabIndex={3}
                />
                
                {/* Input Name */}
                <InputCustom
                    id="name-input"
                    type="text"
                    label={t('modals.add_account.representativeNameLabel')}
                    placeholder={t('modals.add_account.representativeNamePlaceholder')}
                    value={representativeName}
                    action={(value)=>handleRepresentativeNameChange(value as string)}
                    error={errors.representativeName}
                    tabIndex={3}
                />

            </div>

            {/* Footer */}
            <div className="p-6 bg-surface-muted/30 border-t border-border flex justify-end gap-3 mt-auto">
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="px-4 py-2 bg-surface hover:bg-surface-hover border border-border text-foreground rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                    {t('modals.add_account.cancel')}
                </button>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed min-w-35 justify-center"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {t('modals.add_account.save')}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};