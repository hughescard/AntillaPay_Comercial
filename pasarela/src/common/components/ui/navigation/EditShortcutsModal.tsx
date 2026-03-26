'use client';

import { useState, useEffect } from 'react';
import { X, Pin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ShortcutItem } from '@/lib/shortcutsUtils';

interface EditShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecent: ShortcutItem[];
  initialPinned: ShortcutItem[];
  onSave: (pinned: ShortcutItem[], recent: ShortcutItem[]) => void;
}

export const EditShortcutsModal = ({
  isOpen,
  onClose,
  initialRecent,
  initialPinned,
  onSave,
}: EditShortcutsModalProps) => {
  const { t } = useTranslation();
  
  const [tempPinned, setTempPinned] = useState<ShortcutItem[]>([]);
  const [tempRecent, setTempRecent] = useState<ShortcutItem[]>([]);
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true); 
      setTempPinned([...initialPinned]);
      setTempRecent(initialRecent.filter(r => !initialPinned.some(p => p.href === r.href)));
    } else {
      setIsVisible(false)
    }
  }, [isOpen, initialRecent, initialPinned]);

  const handlePin = (item: ShortcutItem) => {
    setTempPinned([...tempPinned, item]);
    setTempRecent(tempRecent.filter((i) => i.href !== item.href));
  };

  const handleUnpin = (item: ShortcutItem) => {
    setTempPinned(tempPinned.filter((i) => i.href !== item.href));
    setTempRecent([item, ...tempRecent]);
  };

  const handleClearAll = () => {
    setTempPinned([]);
    setTempRecent([]);
  };

  const handleClose = () =>{
    setIsVisible(false)
    const timer = setTimeout(() => {
        onClose();
      }, 200);
    return () => clearTimeout(timer);

  }

  const handleSave = () => {
    onSave(tempPinned, tempRecent);
    setIsVisible(false)
    const timer = setTimeout(() => {
        onClose();
      }, 200);
    return () => clearTimeout(timer);
  };


  if (!isOpen) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-[100] flex items-center justify-center w-screen
        bg-[var(--overlay)] backdrop-blur-sm
        transition-opacity duration-200 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'} 
      `}
    >
      <div 
        className={`
          w-[90%] mx-auto md:w-full max-w-md bg-[var(--surface)] rounded-lg shadow-2xl overflow-hidden p-6
          transform transition-all duration-200 ease-in-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-[var(--foreground)]">{t('nav.manageShortcuts')}</h3>
        </div>

        {/* Listas */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {tempPinned.length > 0 && 
            <div>
                <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-[var(--foreground)]">{t('nav.pinnedSection')}</h4>
                {tempPinned.length > 0 && (
                    <span className="text-xs text-[var(--subtle-foreground)]">{tempPinned.length} {t('nav.itemsLabel')}</span>
                )}
                </div>
                
                <div className="space-y-1">
                {tempPinned.length === 0 && <p className="text-sm text-[var(--subtle-foreground)] italic py-2">{t('nav.noPinnedItems')}</p>}
                {tempPinned.map((item) => (
                    <div key={item.href} className="flex items-center justify-between group p-2 hover:bg-[var(--surface-muted)] rounded-md transition-colors">
                    <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
                        <Pin size={16} className="text-[var(--subtle-foreground)]" /> 
                        <span className="text-sm font-medium">{t(item.label)}</span>
                    </div>
                    <button 
                        onClick={() => handleUnpin(item)}
                        className="text-[var(--subtle-foreground)] hover:text-[var(--danger)] cursor-pointer hover:bg-[var(--danger-surface)] p-1 rounded transition-colors"
                    >
                        <X size={16} />
                    </button>
                    </div>
                ))}
                </div>
            </div>
          }
          {/* Sección Recientes */}
          {(tempRecent.length > 0 || tempPinned.length === 0 )&& 
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-[var(--foreground)] ">{t('nav.recentSection')}</h4>
               <button 
                onClick={handleClearAll}
                className="text-xs text-[var(--accent)] cursor-pointer hover:text-[var(--accent-hover)] font-medium transition-colors"
              >
                {t('nav.clearAll')}
              </button>
            </div>

            <div className="space-y-1">
              {tempRecent.length === 0 && <p className="text-sm text-[var(--subtle-foreground)] italic py-2">{t('nav.emptyHistory')}</p>}
              {tempRecent.map((item) => (
                <div key={item.href} className="flex items-center justify-between group p-2 hover:bg-[var(--surface-muted)] rounded-md transition-colors">
                  <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
                    <Clock size={16} className="text-[var(--subtle-foreground)]" />
                    <span className="text-sm">{t(item.label)}</span>
                  </div>
                  <button 
                    onClick={() => handlePin(item)}
                    className="text-[var(--disabled-foreground)] hover:text-[var(--muted-foreground)] p-1 cursor-pointer rounded transition-colors hover:bg-[var(--surface-strong)]"
                    title={t('nav.pin')}
                  >
                    <Pin size={16} className="rotate-45" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          }


        </div>

        {/* Footer Buttons */}
        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-[var(--divider)]">
          <button
            onClick={handleClose}
            className="px-4 py-2 cursor-pointer text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] rounded-md transition-colors"
          >
            {t('nav.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 cursor-pointer text-sm font-medium text-[var(--accent-foreground)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-md shadow-sm transition-colors"
          >
            {t('nav.save')}
          </button>
        </div>

      </div>
    </div>
  );
};
