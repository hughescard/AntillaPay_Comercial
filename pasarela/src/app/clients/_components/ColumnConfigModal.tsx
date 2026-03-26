/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useTranslation } from 'react-i18next';
import { X, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { ColumnConfig } from '../page';
import { useState, useEffect } from 'react';
import { useModalShortcuts } from '@/common/hooks/useModalShortcuts';

interface ColumnConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ColumnConfig[];
  setConfig: (config: ColumnConfig[]) => void;
}

export const ColumnConfigModal = ({ isOpen, onClose, config, setConfig }: ColumnConfigModalProps) => {
  const { t } = useTranslation();
  const [configLocal, setConfigLocal] = useState(config);
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setConfigLocal(config); 
    } else {
      setIsVisible(false);
    }
  }, [isOpen, config]);

  const handleClose = () => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      onClose();
    }, 200); 
    return () => clearTimeout(timer);
  };

  const toggleVisibility = (key: string) => {
    setConfigLocal(configLocal.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === configLocal.length - 1)) return;
    
    const newConfig = [...configLocal];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newConfig[index], newConfig[swapIndex]] = [newConfig[swapIndex], newConfig[index]];
    
    const reordered = newConfig.map((col, idx) => ({ ...col, order: idx }));
    setConfigLocal(reordered);
  };

  const handleSave = () => {
    sessionStorage.setItem("clientTableConfig", JSON.stringify(configLocal));
    setConfig(configLocal);
    handleClose(); 
  };

  useModalShortcuts(
      isOpen,       
      handleClose,  
      handleSave 
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
          bg-surface w-full max-w-lg rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh]
          transform transition-all duration-200 ease-in-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        <div className="flex justify-between items-center p-5 border-b border-border">
          <div>
            <h3 className="text-lg font-bold text-foreground">{t('clients.columns.modal_title')}</h3>
            <p className="text-xs text-muted-foreground">{t('clients.columns.description')}</p>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex justify-around w-full overflow-y-auto p-6 custom-scrollbar">
          {/* Sección Visibilidad */}
          <div className="mb-6 w-[60%]">
            <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">{t('clients.columns.visibility')}</h4>
            <div className="space-y-2">
              {configLocal.map(col => (
                <label key={col.key} className="flex items-center gap-3 p-2 rounded hover:bg-surface-muted cursor-pointer border border-transparent hover:border-border">
                  <input 
                    type="checkbox" 
                    checked={col.visible} 
                    disabled={col.key === 'actions'} 
                    onChange={() => toggleVisibility(col.key)}
                    className="accent-accent w-4 h-4 rounded cursor-pointer"
                  />
                  <span className={`text-sm ${col.visible ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {t(col.label as 
                        'clients.table.col_name'
                        | 'clients.table.col_email'
                        | 'clients.table.col_created'
                        | 'clients.table.col_type'
                        | 'clients.table.col_balance'
                        | 'clients.table.col_status'
                        | 'clients.table.col_actions'
                        | 'clients.table.action_view'
                    )} {col.key === 'actions' && <span className="text-xs text-muted-foreground ml-2">({t('clients.columns.fixed')})</span>}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sección Orden */}
          <div className='w-full'>
            <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">{t('clients.columns.order')}</h4>
            <div className="space-y-2">
              {configLocal.filter(c => c.visible).map((col, index, arr) => (
                <div key={col.key} className="flex items-center justify-between p-3 bg-surface-muted/50 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{t(col.label as 
                        'clients.table.col_name'
                        | 'clients.table.col_email'
                        | 'clients.table.col_created'
                        | 'clients.table.col_type'
                        | 'clients.table.col_balance'
                        | 'clients.table.col_status'
                        | 'clients.table.col_actions'
                        | 'clients.table.action_view'
                    )}</span>
                    {col.key === 'actions' && <span className="text-[10px] bg-surface-strong px-2 py-0.5 rounded text-muted-foreground">{t('clients.columns.fixed')}</span>}
                  </div>
                  
                  {col.key !== 'actions' && (
                    <div className="flex gap-1">
                      <button 
                        onClick={() => moveColumn(index, 'up')}
                        disabled={index === 0}
                        className="p-1 cursor-pointer hover:bg-surface-strong rounded disabled:opacity-30 disabled:hover:bg-transparent text-foreground"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button 
                        onClick={() => moveColumn(index, 'down')}
                        disabled={index === arr.length - 1} 
                        className="p-1 cursor-pointer hover:bg-surface-strong rounded disabled:opacity-30 disabled:hover:bg-transparent text-foreground"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-border flex justify-end gap-3 bg-surface-muted/30 rounded-b-xl">
          <button onClick={handleClose} className="px-4 py-2 cursor-pointer text-sm font-medium text-foreground hover:bg-surface-muted rounded-md transition-colors">
            {t('clients.export.cancel')}
          </button>
          <button onClick={handleSave} className="px-4 cursor-pointer py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-md transition-colors shadow-sm">
            {t('clients.columns.save')}
          </button>
        </div>
      </div>
    </div>
  );
};