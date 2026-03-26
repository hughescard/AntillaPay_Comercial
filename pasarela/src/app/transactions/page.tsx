/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { Skeleton } from '@mui/material';
import { GenericTable } from '@/common/components/ui/GenericTable';
import { Filters } from '@/common/components/ui/Filters';
import { pagination } from '@/common/types/pagination';
import { TransferFilters, uiState as uiStateTransaction, uiStateTransfer } from '@/common/types/filtersTypes';
import { Transfer } from '@/common/types/transfer';
import { PropsPayinsExports, PropsTransferExports, useTransactions } from '@/common/hooks/useTransactions';
import { Payin } from '@/common/types/payin';
import { ExportModal } from '@/common/components/ui/ExportModal';
import { ColumnConfig } from '../clients/page';
import { useRbacSimulation } from '@/common/context';
import { clientDetailsHref } from '@/lib/detailRoutes';

const DEFAULT_COLUMNS_PAYIN = [
  { key: 'client', label: 'transactions.table.col_client', visible: true, order: 0 },
  { key: 'createdAt', label: 'transactions.table.col_date', visible: true, order: 1 },
  { key: 'amount', label: 'transactions.table.col_amount', visible: true, order: 2 },
  { key: 'status', label: 'transactions.table.col_status', visible: true, order: 3 },
  { key: 'currency', label: 'transactions.table.col_currency', visible: true, order: 4 },
];


const PAYIN_EXPORT_COLUMNS: ColumnConfig[] = [
  { key: 'customerName', label: 'transactions.table.col_name', visible: true, order: 0 },
  { key: 'customerEmail', label: 'transactions.table.col_email', visible: true, order: 1 },
  { key: 'createdAt', label: 'transactions.table.col_date', visible: true, order: 2 },
  { key: 'amount', label: 'transactions.table.col_amount', visible: true, order: 3 },
  { key: 'status', label: 'transactions.table.col_status', visible: true, order: 4 },
  { key: 'currency', label: 'transactions.table.col_currency', visible: true, order: 5 },
];

const TRANSFER_EXPORT_COLUMNS: ColumnConfig[] = [
  { key: 'senderBusinessName', label: 'transactions.table.col_client', visible: true, order: 0 },
  { key: 'senderEmail', label: 'transactions.table.col_email', visible: true, order: 1 },
  { key: 'createdAt', label: 'transactions.table.col_date', visible: true, order: 2 },
  { key: 'amount', label: 'transactions.table.col_amount', visible: true, order: 3 },
  { key: 'status', label: 'transactions.table.col_status', visible: true, order: 4 },
  { key: 'currency', label: 'transactions.table.col_currency', visible: true, order: 5 },
];

const TRANSFER_AVAILABLE_COLUMNS: ColumnConfig[] = [
  { key: 'senderBusinessName', label: 'transactions.table.col_name', visible: true, order: 0 },
  { key: 'senderEmail', label: 'transactions.table.col_email', visible: true, order: 1 },
  { key: 'createdAt', label: 'transactions.table.col_date', visible: true, order: 2 },
  { key: 'amount', label: 'transactions.table.col_amount', visible: true, order: 3 },
  { key: 'status', label: 'transactions.table.col_status', visible: true, order: 4 },
  { key: 'currency', label: 'transactions.table.col_currency', visible: true, order: 5 },
];

const statusStyles: Record<'Pending' | 'Completed' | 'Rejected', string> = {
  Pending: 'border-yellow-300 bg-yellow-50 text-yellow-700',
  Completed: 'border-green-300 bg-green-50 text-green-700',
  Rejected: 'border-red-300 bg-red-50 text-red-700',
};


export default function TransactionsPage() {
  const { t } = useTranslation();
  const { hasPermission } = useRbacSimulation();
  const canViewPayments = hasPermission('view_payments');
  const canViewIncomingTransfers = hasPermission('view_incoming_transfers');
  const canExportPayments = hasPermission('export_payments');
  const canExportIncomingTransfers = hasPermission('export_incoming_transfers');
  
  const [data, setData] = useState<Transfer[] | Payin[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<pagination>();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'payments' | 'transfers'>(
    canViewPayments ? 'payments' : 'transfers'
  );

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

 const { getTransfers,getPayins,getExportTransfers,getExportPayins } = useTransactions(); 

  useEffect(() => {
    if (activeTab === 'payments' && !canViewPayments && canViewIncomingTransfers) {
      setActiveTab('transfers');
      return;
    }
    if (activeTab === 'transfers' && !canViewIncomingTransfers && canViewPayments) {
      setActiveTab('payments');
    }
  }, [activeTab, canViewIncomingTransfers, canViewPayments]);

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

  const exportColumnConfig = useMemo<ColumnConfig[]>(() => {
    if (activeTab === 'transfers') {
      return TRANSFER_EXPORT_COLUMNS;
    }

    const clientColumn = columnConfig.find((column) => column.key === 'client');
    const clientVisible = clientColumn?.visible ?? true;
    const clientOrder = clientColumn?.order ?? 0;

    const columnsWithoutClient = columnConfig
      .filter((column) => column.key !== 'client')
      .map((column) => ({
        ...column,
        order: column.order > clientOrder ? column.order + 1 : column.order,
      }));

    return [
      {
        key: 'customerName',
        label: 'transactions.table.col_name',
        visible: clientVisible,
        order: clientOrder,
      },
      {
        key: 'customerEmail',
        label: 'transactions.table.col_email',
        visible: clientVisible,
        order: clientOrder + 1,
      },
      ...columnsWithoutClient,
    ];
  }, [columnConfig, activeTab]);

  const exportAvailableColumns = useMemo<ColumnConfig[]>(() => {
    if (activeTab === 'transfers') {
      return TRANSFER_AVAILABLE_COLUMNS;
    }
    return PAYIN_EXPORT_COLUMNS;
  }, [activeTab]);

  useEffect(() => {
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

      const response = activeTab === 'transfers' ? await getTransfers({...params,way:'in'}) : await getPayins(params);
      
      if (response.success) {
        setData(response.data); 
        setPagination(response.pagination);
        setCurrentPage(response.pagination.page);
      }

      setLoading(false);
    };
    
    if(prevSearch.current !== filters.search){
      prevSearch.current = filters.search;
      const timeoutId = setTimeout(async () => fetchTransactions(),1000);
      return () => {
        clearTimeout(timeoutId);
      };
    }else{
      fetchTransactions();
    }
   
  }, [currentPage, filters.dateRange, filters.search, filters.status, uiState, activeTab]); 

  const renderCell = (item: Transfer | Payin, key: string) => {
   
    switch(key){
      case 'client': {
        const record = item as (Payin & Transfer);
        const clientId =
          activeTab === 'transfers'
            ? record.senderCustomerId
            : record.customerId || record.senderCustomerId || record.senderBusinessId;
        const clientEmail = record.customerEmail || record.senderEmail || '-';
        const clientName = record.customerName || record.senderBusinessName || '';

        return(
          <div className="flex flex-col">
            {clientId ? (
              <Link href={clientDetailsHref(clientId)} className="font-semibold text-accent hover:text-accent-hover">{clientEmail}</Link>
            ) : (
              <span className="font-semibold">{clientEmail}</span>
            )}
            <span className="text-muted-foreground">{clientName}</span>
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
            
                <h1 className="text-2xl font-bold text-foreground mb-6">{t('transactions.title')}</h1>

                {/* PESTAÑAS (TABS) */}
                <div className="flex gap-6 border-b border-border mb-6">
                    <button 
                        onClick={() => setActiveTab('payments')} 
                        disabled={!canViewPayments}
                        className={`pb-3 text-sm font-medium cursor-pointer border-b-2 transition-colors ${activeTab === 'payments' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        {t('transactions.tabs.payments')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('transfers')} 
                        disabled={!canViewIncomingTransfers}
                        className={`pb-3 text-sm font-medium cursor-pointer border-b-2 transition-colors ${activeTab === 'transfers' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        {t('transactions.tabs.transfers')}
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
                        {t('transactions.table.total_showing', { count: pagination ? pagination.total : 0 })}
                    </span>
                    <div className="flex gap-2">
                        <button
                          onClick={()=>((activeTab === 'payments' ? canExportPayments : canExportIncomingTransfers) && setIsExportOpen(true))}
                          disabled={activeTab === 'payments' ? !canExportPayments : !canExportIncomingTransfers}
                          className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-md text-sm font-medium hover:bg-surface-muted cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Download size={16} /> {t('transactions.export.button')}
                        </button>
                    </div>
                </div>

                {/* TABLA */}
                {loading ? 
                    <Skeleton animation='wave' width={"100%"} height={150}/>
                :
                (filteredData.length > 0 ?
                  activeTab ? 
                    <GenericTable<Transfer>
                        data={filteredData as Transfer[]}
                        columns={columnConfig}
                        renderCellContent={(item:Transfer, key:string)=>renderCell(item,key)}
                        renderMenuActions={renderMenuActions}
                        hideMenu={true}
                    />
                  :
                   <GenericTable<Payin>
                        data={filteredData as Payin[]}
                        columns={columnConfig}
                        renderCellContent={(item:Payin, key:string)=>renderCell(item,key)}
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
        <ExportModal
            key={activeTab}
            isOpen={isExportOpen} 
            onClose={() => setIsExportOpen(false)} 
            currentColumnConfig={exportColumnConfig}
            filters={filters}
            uiState={uiState as uiStateTransfer}
            action={(params)=>{if(activeTab === 'transfers'){
              getExportTransfers({...params,way:'in'} as PropsTransferExports)
            }else{
              getExportPayins(params as PropsPayinsExports)
            }}}
            availableColumns={exportAvailableColumns}
        />
    </div>
  );
}
