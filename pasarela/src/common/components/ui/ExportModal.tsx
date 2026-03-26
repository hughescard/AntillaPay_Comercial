/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useTranslation } from 'react-i18next';
import { Loader2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ClientFilters, PaymentLinkFilters, ProductFilters, TransferFilters, uiStateClient, uiStatePaymentLink, uiStateProduct, uiStateTransfer } from '@/common/types/filtersTypes';
import { ColumnConfig } from '@/app/clients/page';
import { PropsCustomersExports, useCustomers } from '@/app/clients/_hooks/useCustomers';
import { PropsTransferExports } from '@/common/hooks/useTransactions';
import { PropsExportProducts } from '@/app/products/_hooks/useProducts';
import { PaymentLinksExport } from '@/app/paymentLink/hooks/usePaymentLinks';
import { useModalShortcuts } from '@/common/hooks/useModalShortcuts';

export type ClientData = {
  id: string;
  name: string;
  businessName: string;
  email: string;
  createdAt: string;
  type:'business' | 'customer'
}


interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColumnConfig: ColumnConfig[];
  filters:ClientFilters | TransferFilters | ProductFilters | PaymentLinkFilters;
  uiState:uiStateClient | uiStateTransfer | uiStateProduct | uiStatePaymentLink;
  action:(params: PropsCustomersExports | PropsTransferExports | PropsExportProducts |PaymentLinksExport )=>void;
  availableColumns: { key: string; label: string }[];
}

export const ExportModal = ({ isOpen, onClose, currentColumnConfig,filters,uiState,action, availableColumns }: ExportModalProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [format, setFormat] = useState<'excel' | 'csv'>('excel');
  const [scope, setScope] = useState<'all' | 'filtered'>('filtered');
  const [useCurrentColumns, setUseCurrentColumns] = useState(true);
  const [loading,setLoading] = useState(false);
  
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    availableColumns.map(col => col.key)
  );

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

  const handleColumnToggle = (key: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key); 
      } else {
        return [...prev, key]; 
      }
    });
  };

  const handleConfirm = async() => {
    const columnsToExport = useCurrentColumns ? [...currentColumnConfig]
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order)
    .map(col => col.key) : selectedColumns;
  
  
    setLoading(true);
    let months = null;
      if(uiState.showDate){
          switch(filters.dateRange){
              case 'month':
                  months = 1;
                  break;
              case 'quarter':
                  months = 3;
                  break;
              case 'semester':
                  months = 6;
                  break;
              case 'year':
                  months = 12;
                  break;
          }
      }

    const params = {
        type: scope === 'filtered' ? ((uiState as uiStateClient).showType ? (filters as ClientFilters).type : null ) : null,
        status: scope === 'filtered' ? ((uiState as uiStateTransfer).showStatus ? (filters as TransferFilters | ProductFilters).status : null ) : null,
        months: scope === 'filtered' ? months : null,
        query: scope === 'filtered' ? filters.search : null,
        fields:columnsToExport.join(',') ,
        extension:format
    }   

    await action(params);
    
    setLoading(false);
    
    handleClose();
  };

  useModalShortcuts(
    isOpen,       
    handleClose,  
    handleConfirm 
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
          bg-surface w-full max-w-md rounded-xl shadow-2xl border border-border 
          transform transition-all duration-200 ease-in-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          max-h-[90vh] overflow-y-auto custom-scrollbar
        `}
      >
        <div className="flex justify-between items-center p-5 border-b border-border sticky top-0 bg-surface z-10">
          <h3 className="text-lg font-bold text-foreground">{t('clients.export.modal_title')}</h3>
          <button 
            onClick={handleClose} 
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Formato */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-foreground">{t('clients.export.format')}</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="format" 
                  className="accent-accent w-4 h-4 cursor-pointer" 
                  checked={format === 'excel'}
                  onChange={() => setFormat('excel')}
                />
                <span className="text-sm group-hover:text-foreground transition-colors">Excel (.xlsx)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="format" 
                  className="accent-accent w-4 h-4 cursor-pointer" 
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                />
                <span className="text-sm group-hover:text-foreground transition-colors">CSV</span>
              </label>
            </div>
          </div>

          {/* Alcance */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-foreground">{t('clients.export.scope')}</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="scope" 
                  className="accent-accent w-4 h-4 cursor-pointer" 
                  checked={scope === 'all'}
                  onChange={() => setScope('all')}
                />
                <span className="text-sm group-hover:text-foreground transition-colors">{t('clients.export.scope_all')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="scope" 
                  className="accent-accent w-4 h-4 cursor-pointer" 
                  checked={scope === 'filtered'}
                  onChange={() => setScope('filtered')}
                />
                <span className="text-sm group-hover:text-foreground transition-colors">{t('clients.export.scope_filtered')}</span>
              </label>
            </div>
          </div>

          {/* Configuración de Columnas */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-foreground">{t('clients.export.columns_config')}</label>
            
            {/* Checkbox principal "Usar configuración actual" */}
            <label className="flex items-start gap-2 cursor-pointer group mb-3">
              <input 
                type="checkbox" 
                className="mt-1 accent-accent rounded w-4 h-4 cursor-pointer" 
                checked={useCurrentColumns}
                onChange={(e) => setUseCurrentColumns(e.target.checked)}
              />
              <div className="text-sm group-hover:text-foreground transition-colors">
                <p className="font-medium text-foreground">{t('clients.export.use_current')}</p>
                <p className="text-muted-foreground text-xs">{t('clients.export.info')}</p>
              </div>
            </label>

            {/* Selección Manual de Columnas (Se muestra si useCurrentColumns es false) */}
            {!useCurrentColumns && (
              <div className="pl-6 animate-in fade-in slide-in-from-top-2 duration-200">
                 
                 <div className="grid grid-cols-3 gap-2">
                    {availableColumns.map((col) => (
                      <label key={col.key} className="flex items-center gap-2 cursor-pointer group p-1 hover:bg-surface-muted rounded transition-colors">
                        <input 
                          type="checkbox" 
                          className="accent-accent rounded w-3.5 h-3.5 cursor-pointer" 
                          checked={selectedColumns.includes(col.key)}
                          onChange={() => handleColumnToggle(col.key)}
                        />
                        <span className="text-sm text-foreground group-hover:font-medium transition-all">
                          {t(col.label as 'clients.table.col_name' 
                            | 'clients.table.col_business_name'
                            | 'clients.table.col_email' 
                            | 'clients.table.col_created'
                            |'clients.table.col_type' )}
                        </span>
                      </label>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-border flex justify-end gap-3 bg-surface-muted/30 rounded-b-xl sticky bottom-0">
          <button 
            onClick={handleClose} 
            className="px-4 py-2 cursor-pointer text-sm font-medium text-foreground hover:bg-surface-muted rounded-md transition-colors"
          >
            {t('clients.export.cancel')}
          </button>
          <button 
            onClick={handleConfirm}
            className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-md transition-colors shadow-sm"
          >
           {!loading ? (
              t('clients.export.confirm')
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