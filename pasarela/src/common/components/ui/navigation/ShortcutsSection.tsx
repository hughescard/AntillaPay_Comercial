'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Clock, Menu, Pin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useShortcuts } from '@/common/hooks/useShortcuts'; 
import { EditShortcutsModal } from './EditShortcutsModal'; 
import { ShortcutItem } from '@/lib/shortcutsUtils';

  
export const ShortcutsSection = ({ isCollapsed, onNavigate }: { isCollapsed: boolean, onNavigate?: () => void;  }) => {
  const { t } = useTranslation();
  const { recentLinks, pinnedLinks, savePinned, saveRecent } = useShortcuts();
  
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [floatingMenuPos, setFloatingMenuPos] = useState<{ top: number; left: number } | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const displayRecent = recentLinks.filter((r:ShortcutItem) => !pinnedLinks.some(p => p.href === r.href));
  const allShortcuts = [...pinnedLinks, ...displayRecent];
  const hasItems = allShortcuts.length > 0;

  const handleMouseEnterIcon = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCollapsed) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const rect = e.currentTarget.getBoundingClientRect();
    setFloatingMenuPos({
      top: rect.top,
      left: rect.right,
    });
  };

  const handleMouseLeave = () => {
    if (!isCollapsed) return;
    timeoutRef.current = setTimeout(() => {
      setFloatingMenuPos(null);
    }, 300); 
  };

  const handleQuickPin = (e: React.MouseEvent, item: ShortcutItem) => {
    e.preventDefault(); e.stopPropagation();
    savePinned([...pinnedLinks, item]);
  };

  const handleQuickUnpin = (e: React.MouseEvent, item: ShortcutItem) => {
    e.preventDefault(); e.stopPropagation();
    savePinned(pinnedLinks.filter((p:ShortcutItem) => p.href !== item.href));
  };

  return (
    <>
      <div 
        className={`p-1
          grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out
          ${hasItems ? 'grid-rows-[1fr] opacity-100 mt-6 mb-2' : 'grid-rows-[0fr] opacity-0 mt-0 mb-0'}
        `}
      >
        <div className="overflow-hidden min-h-0">
          <div className={`relative ${isCollapsed ? 'flex justify-start' : 'px-3'}`}>
            
            {!isCollapsed && (
              <>
                {/* Header de la sección */}
                <div className="group/header flex items-center justify-between px-3 h-6 mb-2">
                  <h3 className="text-xs font-light text-[var(--subtle-foreground)] tracking-wide">
                    {t('nav.shortcutsTitle')}
                  </h3>
                  <button
                    onClick={() => setIsManageModalOpen(true)}
                    className={`
                      p-1 -mr-1 text-[var(--subtle-foreground)] hover:text-[var(--foreground)] cursor-pointer hover:bg-[var(--surface-muted)] rounded 
                      transition-opacity duration-200
                      
                      opacity-100                        
                      md:opacity-0 md:group-hover/header:opacity-100 
                    `}
                    title={t('nav.manage')}
                  >
                    <Menu size={14} />
                  </button>
                </div>

                {/* Lista de links */}
                <div className="space-y-0.5">
                  {allShortcuts.map((item) => {
                    const isPinned = pinnedLinks.some((p) => p.href === item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className="group/item flex items-center justify-between px-3 py-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] rounded-md transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Clock size={18} className="text-[var(--muted-foreground)] group-hover/item:text-[var(--foreground)] flex-shrink-0 transition-colors" />
                          <span className="truncate">{t(item.label)}</span>
                        </div>
                        
                        <div 
                          onClick={(e) => isPinned ? handleQuickUnpin(e, item) : handleQuickPin(e, item)}
                          className={`
                            p-1 rounded cursor-pointer transition-all duration-200
                            
                            ${isPinned 
                              ? 'text-[var(--muted-foreground)] opacity-100'
                              : 'text-[var(--subtle-foreground)] hover:bg-[var(--surface-strong)] opacity-100 md:opacity-0 md:group-hover/item:opacity-100' 
                            }
                          `}
                          title={isPinned ? t('nav.unpin') : t('nav.pin')}
                        >
                          <Pin size={14} className={isPinned ? "fill-[var(--muted-foreground)]" : "rotate-45"} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            {isCollapsed && (
              <div className="flex items-center justify-start ml-4 w-full py-2 group">
                <div 
                  onMouseEnter={handleMouseEnterIcon}
                  onMouseLeave={handleMouseLeave}
                  className="p-2 rounded-md text-[var(--foreground)] hover:bg-[var(--surface-muted)] cursor-pointer hover:text-[var(--foreground)] transition-colors"
                >
                  <Clock size={20} />
                </div>
              </div>
            )}

            {/* --- MODAL FLOTANTE (Solo Escritorio Colapsado) --- */}
            {isCollapsed && floatingMenuPos && (
              <div
                className="fixed isolate z-[160] w-64 overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-2xl ring-1 ring-black/5 p-1 flex flex-col gap-1"
                style={{
                  top: floatingMenuPos.top - 10, 
                  left: floatingMenuPos.left + 20,
                  backgroundColor: 'rgb(255, 255, 255)',
                  opacity: 1,
                }}
                onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}
                onMouseLeave={handleMouseLeave}
              >
                <div className="group flex items-center justify-between px-3 py-2 border-b border-[var(--divider)] mb-1">
                  <span className="text-xs font-semibold text-[var(--subtle-foreground)] ">
                    {t('nav.shortcutsTitle')}
                  </span>
                  <button
                    onClick={() => setIsManageModalOpen(true)}
                    className="p-1 text-[var(--subtle-foreground)] hover:text-[var(--foreground)] cursor-pointer hover:bg-[var(--surface-muted)] rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Menu size={14} />
                  </button>
                </div>

                {allShortcuts.map((item) => {
                  const isPinned = pinnedLinks.some(p => p.href === item.href);
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className="group flex items-center justify-between px-3 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Clock size={16} className="text-[var(--subtle-foreground)] flex-shrink-0" />
                        <span className="font-medium truncate">{t(item.label)}</span>
                      </div>
                      <div 
                         onClick={(e) => isPinned ? handleQuickUnpin(e, item) : handleQuickPin(e, item)}
                         className={`
                           p-1 rounded cursor-pointer transition-all duration-200 ml-2
                           ${isPinned ? 'text-[var(--muted-foreground)] opacity-100' : 'text-[var(--subtle-foreground)] opacity-0 group-hover:opacity-100 hover:bg-[var(--surface-strong)]'}
                         `}
                      >
                        <Pin size={14} className={isPinned ? "fill-[var(--muted-foreground)]" : "rotate-45"} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <EditShortcutsModal 
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        initialPinned={pinnedLinks}
        initialRecent={recentLinks}
        onSave={(newPinned:ShortcutItem[], newRecent:ShortcutItem[]) => {
          savePinned(newPinned);
          saveRecent(newRecent);
        }}
      />
    </>
  );
};
