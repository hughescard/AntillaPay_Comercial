/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useModalShortcuts } from '@/common/hooks/useModalShortcuts';

interface SandboxOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SandboxOutModal = ({ isOpen, onClose, onConfirm }: SandboxOutModalProps) => {
  const { t } = useTranslation();
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
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

  useModalShortcuts(
    isOpen,       
    handleClose,  
    onConfirm 
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
          bg-surface w-full max-w-lg rounded-xl shadow-2xl border border-border flex flex-col
          transform transition-all duration-200 ease-in-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        <div className="flex justify-end p-4 pb-0">
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8 pt-2">
          <h2 className="text-2xl font-bold text-foreground mb-4 leading-tight">
            {t('modals.sandbox.title')}
          </h2>
          
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            {t('modals.sandbox.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => {
                handleClose();
              }}
              className="flex-1 px-4 py-2.5 cursor-pointer text-sm font-medium text-foreground hover:bg-surface-muted bg-surface border border-border rounded-lg transition-colors text-center"
            >
              {t('modals.sandbox.stay_button')}
            </button>
            
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 cursor-pointer text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm text-center"
            >
              {t('modals.sandbox.confirm_button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};