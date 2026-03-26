/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// 1. Agregamos el icono Plus
import { Download, ChevronLeft, ChevronRight, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { Skeleton } from '@mui/material';
import { GenericTable } from '@/common/components/ui/GenericTable';
import { Filters } from '@/common/components/ui/Filters';
import { pagination } from '@/common/types/pagination';
import { TransferFilters, uiState as uiStateTransaction, uiStateTransfer } from '@/common/types/filtersTypes';
import { Transfer } from '@/common/types/transfer';
import { Payin } from '@/common/types/payin';
import { ExportModal } from '@/common/components/ui/ExportModal';
import { PropsTransferExports, useTransactions } from '@/common/hooks/useTransactions';
import { NewTransferModal } from './_components/NewTransferModal';
import { useAuth } from '@/common/context/authContext';
import { useRbacSimulation } from '@/common/context';

const DEFAULT_COLUMNS_PAYIN = [
  { key: 'receiverBusinessName', label: 'transactions.table.col_recipient', visible: true, order: 0 },
  { key: 'createdAt', label: 'transactions.table.col_date', visible: true, order: 1 },
  { key: 'amount', label: 'transactions.table.col_amount', visible: true, order: 2 },
  { key: 'status', label: 'transactions.table.col_status', visible: true, order: 3 },
  { key: 'currency', label: 'transactions.table.col_currency', visible: true, order: 4 },
];

const TRANSFER_EXPORT_COLUMNS = [
  { key: 'receiverBusinessName', label: 'transactions.table.col_recipient', visible: true, order: 0 },
  { key: 'receiverEmail', label: 'transactions.table.col_recipient', visible: true, order: 1 },
  { key: 'createdAt', label: 'transactions.table.col_date', visible: true, order: 2 },
  { key: 'amount', label: 'transactions.table.col_amount', visible: true, order: 3 },
  { key: 'status', label: 'transactions.table.col_status', visible: true, order: 4 },
  { key: 'currency', label: 'transactions.table.col_currency', visible: true, order: 5 },
];

const availableColumns = [
  { key: 'receiverBusinessName', label: 'transactions.table.col_name' },
  { key: 'receiverEmail', label: 'transactions.table.col_email' },
  { key: 'createdAt', label: 'transactions.table.col_date' },
  { key: 'amount', label: 'transactions.table.col_amount' },
  { key: 'status', label: 'transactions.table.col_status' },
  { key: 'currency', label: 'transactions.table.col_currency' },
];

const statusStyles: Record<'Pending' | 'Completed' | 'Rejected', string> = {
  Pending: 'border-yellow-300 bg-yellow-50 text-yellow-700',
  Completed: 'border-green-300 bg-green-50 text-green-700',
  Rejected: 'border-red-300 bg-red-50 text-red-700',
};


export default function TransactionsPage() {
  const { t } = useTranslation();
  const {client} = useAuth();
  const { getTransfers, getExportTransfers, createTransfer } = useTransactions(); 
  const {getMyInfo} = useAuth();
  const { hasPermission } = useRbacSimulation();
  const canCreateTransfer = hasPermission('create_internal_transfer');
  const canExportTransfers = hasPermission('export_internal_transfers');

  const [data, setData] = useState<Transfer[] | Payin[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<pagination>();
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [columnConfig, setColumnConfig] = useState(DEFAULT_COLUMNS_PAYIN);
  
  const [filters, setFilters] = useState<TransferFilters>({
    kind: 'transferFilters',
    search: '',
    dateRange: 'month',
    dateSort: 'desc',
    status: 'Completed'
  });

  const prevSearch = useRef(filters.search);
  

 const [uiState, setUiState] = useState<uiStateTransaction>({
    kind: 'transferUiState',
    showDate: false,
    showStatus: false, 
  });


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === 'n' && !['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        e.preventDefault();
        if (canCreateTransfer) {
          setIsTransferModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canCreateTransfer]);

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const processed = [...data];
    if (uiState.showDate) {
      processed.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return filters.dateSort === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }
    return processed;
  }, [data, filters.dateSort, uiState.showDate]);

  const fetchTransactions = async () => {
    setLoading(true);
    
    let months = null;
    if(uiState.showDate){
        switch(filters.dateRange){
            case 'month': months = 1; break;
            case 'quarter': months = 3; break;
            case 'semester': months = 6; break;
            case 'year': months = 12; break;
        }
    }

    const params = {
      search: filters.search,
      status: (uiState as uiStateTransfer).showStatus ? filters.status : null,
      months: months,
      page: currentPage,
    };

    const response =  await getTransfers({...params,way:'out'});
    
    if (response.success) {
      setData(response.data); 
      setPagination(response.pagination);
      setCurrentPage(response.pagination.page);
    }

    setLoading(false);
  };

  useEffect(() => {
    if(prevSearch.current !== filters.search){
      prevSearch.current = filters.search;
      const timeoutId = setTimeout(async () => fetchTransactions(),1000);
      return () => {
        clearTimeout(timeoutId);
      };
    }else{
      fetchTransactions();
    }
  }, [currentPage, filters.dateRange, filters.search, filters.status, uiState]); 

  const handleCreateTransfer = async (transferData: { businessEmail: string, amount: number }) => {
    const response = await createTransfer({
      businessEmail: transferData.businessEmail,
      amount: Math.round(transferData.amount * 100),
    });

    if (response.success) {
      await fetchTransactions();
      await getMyInfo();
    }

    return { success: response.success, message: response.message };
  };

  const renderCell = (item: Transfer | Payin, key: string) => {
   
    switch(key){
      case 'receiverBusinessName': {
          const transfer = item as Transfer;
          const recipientEmail = transfer.receiverEmail || transfer.senderEmail || '-';
          const recipientName = transfer.receiverBusinessName || transfer.senderBusinessName || '';

          return(
            <div className="flex flex-col">
              <span className="font-semibold">{recipientEmail}</span>
              <span className="text-muted-foreground">{recipientName}</span>
            </div>
          );
      }
      case 'createdAt':
        return(
            <>
              {item.createdAt.split('T')[0]}
            </>
          )
      case 'amount':
        return(
            <>
              {(Number(item.amount)/100).toFixed(2)}
            </>
          )
      case 'status':
        return(
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                statusStyles[item.status as 'Pending' | 'Completed' | 'Rejected']
              }`}
            >
              {t(`transactions.status.${item.status as 'Pending' | 'Completed' | 'Rejected'}` as never)}
            </span>
          )
      case 'currency':
        return(
            <>
              {item.currency}
            </>
          )
        
    }
  };

  const renderMenuActions = (item: Transfer | Payin, close: () => void) => (
    <>
      <Link 
        href={`/transactions/${item.id}`} 
        onClick={close} 
        className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-surface-muted transition-colors"
      >
        <ExternalLink size={16} className="text-muted-foreground"/>
        {t('transactions.actions.view_details')}
      </Link>
    </>
  );


  return (
    <div className='lg:flex h-full min-h-0 overflow-hidden animate-enter-step'>
        <Navbar/>
        <div className='w-full min-w-0 min-h-0 flex flex-col'>
            <Header/>
            <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
            
                {/* 5. Header modificado con Flex Justify Between */}
                <div className="sm:flex justify-between items-center w-full mb-6">
                    <h1 className="text-2xl font-bold text-foreground sm:mb-3">
                        {t('transactions.titleOut')}
                    </h1>

                    <button
                        onClick={() => canCreateTransfer && setIsTransferModalOpen(true)}
                        disabled={!canCreateTransfer}
                        className="flex items-center gap-2 pl-3 pr-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                        <span>{t('transactions.actions.create_transfer')}</span>
                        {/* Badge de la tecla N */}
                        <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-xs font-medium text-white/90">
                            N
                        </span>
                    </button>
                </div>             

                {/* FILTROS */}
                <Filters
                    filters={filters} 
                    setFilters={(val) => setFilters(val as TransferFilters)} 
                    uiState={uiState} 
                    setUiState={(val) => setUiState(val as uiStateTransaction)} 
                />

                {/* INFO Y BOTÓN EXPORTAR */}
                <div className="flex justify-between items-end mb-3 mt-4">
                    <span className="text-sm text-muted-foreground">
                        {t('transactions.table.total_showing_transfers', { count: pagination ? pagination.total : 0 })}
                    </span>
                    <div className="flex gap-2">
                        <button onClick={()=>canExportTransfers && setIsExportOpen(true)} disabled={!canExportTransfers} className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-md text-sm font-medium hover:bg-surface-muted cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-60">
                            <Download size={16} /> {t('transactions.export.button')}
                        </button>
                    </div>
                </div>

                {/* TABLA */}
                {loading ? 
                    <Skeleton animation='wave' width={"100%"} height={150}/>
                :
                (filteredData.length > 0 ?
                    <GenericTable<Transfer>
                      data={filteredData as Transfer[]}
                      columns={columnConfig}
                      renderCellContent={(item:Transfer, key:string)=>renderCell(item,key)}
                      renderMenuActions={renderMenuActions}
                      hideMenu={true}
                  />
                : 
                    <p className='w-full text-center py-8 text-muted-foreground'>{t('common.resultsNotFound')}</p>
                )
                }

                {/* PAGINACIÓN */}
                <div className="flex justify-end items-center gap-4 mt-4">
                    <span className="text-sm text-muted-foreground">
                        {t('transactions.table.page_count', { current: currentPage, total: pagination ? pagination.pages : 0 })}
                    </span>
                    <div className="flex gap-1">
                        <button 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                            disabled={currentPage === 1} 
                            className="p-1.5 rounded-md border border-border bg-surface hover:bg-surface-muted disabled:opacity-50 cursor-pointer"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button 
                            onClick={() => setCurrentPage(Math.min((pagination?.pages || 1), currentPage + 1))} 
                            disabled={currentPage === pagination?.pages} 
                            className="p-1.5 rounded-md border border-border bg-surface hover:bg-surface-muted disabled:opacity-50 cursor-pointer"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
        
        {/* Modales */}
        <ExportModal
            isOpen={isExportOpen} 
            onClose={() => setIsExportOpen(false)} 
            currentColumnConfig={TRANSFER_EXPORT_COLUMNS}
            filters={filters}
            uiState={uiState as uiStateTransfer}
            action={(params)=>{
              getExportTransfers({...params,way:'out'} as PropsTransferExports)
            }}
            availableColumns={availableColumns}
        />
        
        {/* 6. Nuevo Modal de Transferencia */}
        <NewTransferModal 
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            onTransfer={handleCreateTransfer}
            availableAmount={client ? client.netBalance / 100 : 0}
        />
    </div>
  );
}
