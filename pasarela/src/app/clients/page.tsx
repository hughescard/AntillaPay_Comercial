'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Columns, ChevronLeft, ChevronRight } from 'lucide-react';
import { ClientsTable } from './_components/ClientsTable';
import { ColumnConfigModal } from './_components/ColumnConfigModal';
import { ClientData } from '@/common/types/clientsTypes';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { Skeleton } from '@mui/material';
import { pagination } from '@/common/types/pagination';
import { PropsCustomersExports, useCustomers } from './_hooks/useCustomers';
import { ClientFilters, uiStateClient } from '@/common/types/filtersTypes';
import { Filters } from '@/common/components/ui/Filters';
import { ExportModal } from '@/common/components/ui/ExportModal';
import { useRbacSimulation } from '@/common/context';

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'name', label: 'clients.table.col_name', visible: true, order: 0 },
  { key: 'businessName', label: 'clients.table.col_business_name', visible: true, order: 4 },
  { key: 'email', label: 'clients.table.col_email', visible: true, order: 1 },
  { key: 'createdAt', label: 'clients.table.col_created', visible: true, order: 2 },
  { key: 'type', label: 'clients.table.col_type', visible: true, order: 3 },
];

export default function ClientsPage() {
  const { t } = useTranslation();
  const { hasPermission } = useRbacSimulation();
  const canExportCustomers = hasPermission('export_customers');
  const [data,setData] = useState<ClientData[]>();
  const [loading,setLoading] = useState(true);
  const [pagination,setPagination] = useState<pagination>();
  const [filters, setFilters] = useState<ClientFilters>({
    kind:'clientFilter',
    search: '',
    dateRange: 'month',
    dateSort: 'desc',
    type: 'business'
  });
  const {getCustomers,getCustomersExport} = useCustomers();

  const prevSearch = useRef(filters.search);

  const [uiState, setUiState] = useState<uiStateClient>({
    kind:'clientUiState',
    showDate: false,
    showType: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);


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

  useEffect(()=>{
    const fetchClients = async()=>{
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
        type: uiState.showType ? filters.type as 'business' | 'customer' : null,
        months: months,
        page:currentPage,
        query:filters.search,
    }   
    const response = await getCustomers(params);
    if(response.success){
      setData(response.data);
      setPagination(response.pagination);
      setCurrentPage(response.pagination.page);
    }
    setLoading(false);
  }
    if(prevSearch.current !== filters.search){
      prevSearch.current = filters.search;
      const timeoutId = setTimeout(async () => fetchClients(),1000);
      return () => {
        clearTimeout(timeoutId);
      };
    }else{
      fetchClients();
    }
  },[currentPage,filters.search, filters.type,filters.dateRange,uiState])

  useEffect(() => {
    const storedConfig = sessionStorage.getItem('clientTableConfig');
    if (storedConfig) {
      try {
        const parsed = JSON.parse(storedConfig);
        const sorted = parsed.sort((a: ColumnConfig, b: ColumnConfig) => a.order - b.order);
        setColumnConfig(sorted);
      } catch (e) {
        console.error("Error parsing table config", e);
      }
    }
  }, []);



  return (
    <div className='lg:flex h-full min-h-0 overflow-hidden animate-enter-step'>
        <Navbar/>
        <div className='w-full min-w-0 min-h-0 flex flex-col'>
            <Header/>
            <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
            
                {/* Header Página */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-foreground">{t('clients.title')}</h1>
                </div>

                {/* Filtros */}
                <Filters
                    filters={filters} 
                    setFilters={(val)=>setFilters(val as ClientFilters)} 
                    uiState={uiState} 
                    setUiState={(val)=>setUiState(val as uiStateClient)} 
                />

                {/* Info y Botones Superiores Tabla */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-3 gap-4">
                    <span className="text-sm text-muted-foreground">
                    {t('clients.table.total_showing', { count: pagination ? pagination.total : 0 })}
                    </span>
                    
                    <div className="flex gap-2">
                    <button 
                        onClick={() => canExportCustomers && setIsExportOpen(true)}
                        disabled={!canExportCustomers}
                        className="flex items-center gap-2 px-3 py-1.5 cursor-pointer bg-surface border border-border rounded-md text-sm font-medium text-foreground hover:bg-surface-muted transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Download size={16} />
                        {t('clients.export.button')}
                    </button>
                    
                    <button 
                        onClick={() => setIsColumnsOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 cursor-pointer bg-surface border border-border rounded-md text-sm font-medium text-foreground hover:bg-surface-muted transition-colors"
                    >
                        <Columns size={16} />
                        {t('clients.columns.button')}
                    </button>
                    </div>
                </div>

                {/* Tabla */}
                {loading ? 
                    <Skeleton animation='wave' width={"100%"} height={150}/>
                :
                (filteredData.length > 0 ?
                    <ClientsTable data={filteredData} columns={columnConfig} />
                :
                    <p className='w-full text-center'>{t('clients.table.empty')}</p>
                )   
                }
                {/* Paginación */}
                <div className="flex justify-end items-center gap-4 mt-4">
                    <span className="text-sm text-muted-foreground">
                    {t('clients.table.page_count', { current: currentPage, total: pagination ? pagination.pages : 0 })}
                    </span>
                    <div className="flex gap-1">
                    <button 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-md border cursor-pointer border-border bg-surface text-foreground hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
                        disabled={currentPage === pagination?.pages}
                        className="p-1.5 rounded-md border cursor-pointer border-border bg-surface text-foreground hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                    </div>
                </div>

                {/* Modales */}
                <ExportModal
                    isOpen={isExportOpen} 
                    onClose={() => setIsExportOpen(false)} 
                    currentColumnConfig={columnConfig}
                    filters={filters}
                    uiState={uiState}
                    action={(params)=>getCustomersExport(params as PropsCustomersExports)}
                    availableColumns={DEFAULT_COLUMNS}
                />
                
                <ColumnConfigModal 
                    isOpen={isColumnsOpen} 
                    onClose={() => setIsColumnsOpen(false)} 
                    config={columnConfig}
                    setConfig={setColumnConfig}
                />

            </div>
        </div>
    </div>
  );
}
