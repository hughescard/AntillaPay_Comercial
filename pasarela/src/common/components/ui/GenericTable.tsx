/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MoreHorizontal } from 'lucide-react';
import { Modal } from '@/common/components/ui/Modal'; 
import { ColumnConfig } from '@/app/clients/page';

interface GenericTableProps<T> {
  data: T[];
  columns: ColumnConfig[];
  renderMenuActions?: (item: T, closeMenu: () => void) => React.ReactNode;
  renderCellContent: (item: T, key:string) => React.ReactNode;
  hideMenu?: boolean;
}

export const GenericTable = <T extends { id: string }>({ data, columns, renderMenuActions, renderCellContent, hideMenu = false }: GenericTableProps<T>) => {
  const { t } = useTranslation();
  
  const [menuState, setMenuState] = useState<{
    item: T;
    anchorElement: HTMLElement; 
  } | null>(null);

  const [coords, setCoords] = useState({ top: 0, right: 0 });

  const visibleColumns = [...columns]
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  const handleCloseModal = () => setMenuState(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, item: T) => {
    setMenuState({
      item,
      anchorElement: event.currentTarget
    });
  };

  const updatePosition = useCallback(() => {
    if (!menuState?.anchorElement) return;

    const rect = menuState.anchorElement.getBoundingClientRect();
    
    setCoords({
      top: rect.bottom + 5,
      right: window.innerWidth - rect.right 
    });
  }, [menuState]);

  useEffect(() => {
    if (menuState) {
      updatePosition();

      window.addEventListener('resize', updatePosition);
      
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [menuState, updatePosition]);

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-muted-foreground border-b border-border">
            <tr>
              {visibleColumns.map((col) => (
                <th key={col.key} className="px-6 py-3 font-medium whitespace-nowrap">
                  {t(col.label as any)}
                </th>
              ))}
              <th hidden={hideMenu} className="px-6 py-3 font-medium whitespace-nowrap w-10"></th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-surface-muted/50 transition-colors">
                {visibleColumns.map((col) => (
                  <td key={`${item.id}-${col.key}`} className="px-6 py-4 whitespace-nowrap text-foreground">
                    {renderCellContent(item, col.key)}
                  </td>
                ))}
                
                <td hidden={hideMenu} className="px-6 py-4 whitespace-nowrap text-right">
                   <button 
                      onClick={(e) => handleOpenMenu(e, item)}
                      className={`text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1 rounded-md hover:bg-surface-strong ${menuState?.item.id === item.id ? 'bg-surface-strong text-foreground' : ''}`}
                   >
                      <MoreHorizontal size={20}/>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE ACCIONES */}
      <Modal 
        isOpen={!!menuState} 
        onClose={handleCloseModal}
        className="fixed! m-0! w-60 overflow-hidden origin-top-right z-50" 
        style={{ 
          top: coords.top, 
          right: coords.right 
        }}
      >
        {menuState && renderMenuActions && (
          <div className="flex flex-col py-2">
            {renderMenuActions(menuState.item, handleCloseModal)}
          </div>
        )}
      </Modal>
    </>
  );
};