'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnConfig } from '../page';
import { ClientData } from '@/common/types/clientsTypes'; 
import { MoreHorizontal, ExternalLink, Copy } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/common/components/ui/Modal';

interface ClientsTableProps {
  data: ClientData[];
  columns: ColumnConfig[];
}

export const ClientsTable = ({ data, columns }: ClientsTableProps) => {
  const { t } = useTranslation();
  
  const [menuState, setMenuState] = useState<{
    client: ClientData;
    top: number;
    rigth: number;
  } | null>(null);

  const visibleColumns = [...columns]
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  const handleCloseModal = () => {
    setMenuState(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    handleCloseModal();
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, client: ClientData) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const MENU_WIDTH = 250; 
    
    setMenuState({
      client,
      top: rect.bottom + 5, 
      
      rigth: rect.right - MENU_WIDTH 
    });
  };

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg border border-border relative">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-muted-foreground border-b border-border">
            <tr>
              {visibleColumns.map((col) => (
                <th key={col.key} className="px-6 py-3 font-medium whitespace-nowrap">
                  {t(col.label as 'clients.table.col_actions' 
                    | 'clients.table.col_status'
                    | 'clients.table.col_balance'
                    | 'clients.table.col_type'
                    | 'clients.table.col_created'
                    | 'clients.table.col_email'
                    | 'clients.table.col_business_name'
                    | 'clients.table.col_name'
                  )}
                </th>
              ))}
              <th className="px-6 py-3 font-medium whitespace-nowrap w-10"></th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {data.map((client) => (
              <tr key={client.id} className="hover:bg-surface-muted/50 transition-colors">
                {visibleColumns.map((col) => (
                  <td key={`${client.id}-${col.key}`} className="px-6 py-4 whitespace-nowrap text-foreground">
                    {col.key === 'name' && <span className="font-semibold">{client.name}</span>}
                    {col.key === 'businessName' && client.businessName}
                    {col.key === 'email' && client.email}
                    {col.key === 'createdAt' && client.createdAt.split('T')[0]}
                    {col.key === 'type' && t(`clients.filters.type_${client.type}`)}
                    {col.key === 'actions' && (
                      <Link 
                        href={`/clients/${client.id}`}
                        className="text-accent hover:text-accent-hover font-medium text-xs"
                      >
                        {t('clients.table.action_view')}
                      </Link>
                    )}
                  </td>
                ))}
                
                <td className="px-6 py-4 whitespace-nowrap text-right">
                   <button 
                      onClick={(e) => handleOpenMenu(e, client)}
                      className={`text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1 rounded-md hover:bg-surface-strong ${menuState?.client.id === client.id ? 'bg-surface-strong text-foreground' : ''}`}
                   >
                      <MoreHorizontal size={20}/>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <Modal 
        isOpen={!!menuState} 
        onClose={handleCloseModal}
        className="fixed! m-0! w-60 overflow-hidden origin-top-right" 
        style={{ 
          top: menuState?.top, 
          left: menuState?.rigth 
        }}
      >
        {menuState && (
          <div className="flex flex-col py-2">
            
            <Link 
              href={`/clients/${menuState.client.id}`}
              onClick={handleCloseModal}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors text-left"
            >
              <ExternalLink size={16} className="text-muted-foreground"/>
              {t('clientActions.view_details')}
            </Link>

            <div className="h-px bg-border mx-2 my-1 opacity-50" />

            <button 
              onClick={() => handleCopy(menuState.client.email)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-surface-muted transition-colors text-left w-full cursor-pointer"
            >
              <Copy size={16} className="text-muted-foreground"/>
              {t('clientActions.copy_email')}
            </button>

            <button 
              onClick={() => handleCopy(menuState.client.id)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-surface-muted transition-colors text-left w-full cursor-pointer"
            >
              <Copy size={16} className="text-muted-foreground"/>
              {t('clientActions.copy_id')}
            </button>

          </div>
        )}
      </Modal>
    </>
  );
};