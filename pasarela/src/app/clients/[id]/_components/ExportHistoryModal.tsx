/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useTranslation } from 'react-i18next';
import { Loader2, X } from 'lucide-react';
import { useCustomers } from '../../_hooks/useCustomers';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useModalShortcuts } from '@/common/hooks/useModalShortcuts';

interface ExportHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportHistoryModal = ({ isOpen, onClose }: ExportHistoryModalProps) => {
  const { t } = useTranslation();
  const params = useParams();
  const id = params.id as string;
  const { getExportOperations } = useCustomers();
  
  const [type, setType] = useState<'csv' | 'excel'>('csv');
  const [loading, setLoading] = useState(false);
  
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

  const handleExport = async () => {
    setLoading(true);
    await getExportOperations({ type: type, id: id });
    setLoading(false);
    handleClose();
  };

  useModalShortcuts(
    isOpen,       
    handleClose,  
    handleExport 
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
          bg-surface w-full max-w-100 rounded-xl shadow-2xl border border-border
          transform transition-all duration-200 ease-in-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        
        {/* Header */}
        <div className="flex justify-between items-start p-5 pb-2">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {t('clientDetails.export_modal.title')}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t('clientDetails.export_modal.description')}
            </p>
          </div>
          <button 
            onClick={handleClose} 
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 border-b border-border">
          {/* Formato */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-foreground">
              {t('clients.export.format')}
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="historyFormat" 
                  className="accent-accent w-4 h-4 cursor-pointer" 
                  checked={type === 'csv'} 
                  onChange={() => setType('csv')}
                />
                <span className="text-sm group-hover:text-foreground transition-colors">
                  {t('clientDetails.export_modal.format_csv')}
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="historyFormat" 
                  className="accent-accent w-4 h-4 cursor-pointer"
                  checked={type === 'excel'} 
                  onChange={() => setType('excel')}
                />
                <span className="text-sm group-hover:text-foreground transition-colors">
                  {t('clientDetails.export_modal.format_excel')}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-end gap-3 rounded-b-xl">
          <button 
            onClick={handleClose} 
            className="px-4 py-2 cursor-pointer text-sm font-medium text-foreground hover:bg-surface-muted border border-border rounded-md transition-colors"
          >
            {t('clientDetails.export_modal.cancel')}
          </button>
          <button 
            onClick={handleExport}
            disabled={loading}
            className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-md shadow-sm transition-all"
          >
            {!loading ? (
              t('clientDetails.export_modal.confirm')
            ) : (
              <span className='flex gap-1 items-center'>
                <Loader2 width={20} height={20} className='animate-spin'/> 
                {t('common.loading')}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};