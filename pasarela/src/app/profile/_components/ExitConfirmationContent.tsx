'use client';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { useModalShortcuts } from '@/common/hooks/useModalShortcuts';

interface ExitConfirmationContentProps {
  onCancel: () => void;
  onConfirm: () => void;
  isOpen: boolean
}

export const ExitConfirmationContent = ({ onCancel, onConfirm, isOpen }: ExitConfirmationContentProps) => {
  const { t } = useTranslation();
  useModalShortcuts(
    isOpen,       
    onCancel,  
    onConfirm 
  );
  return (
    <div className="p-6 max-w-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
            <AlertCircle size={24} />
        </div>
        <h3 className="text-lg font-bold text-foreground leading-tight">
          {t('profile.exitModalTitle')}
        </h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        {t('profile.exitModalDesc')}
      </p>

      <div className="flex justify-end gap-3">
        <button 
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted rounded-lg transition-colors"
        >
          {t('profile.cancel')}
        </button>
        <button 
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm"
        >
          {t('profile.saveExit')}
        </button>
      </div>
    </div>
  );
};