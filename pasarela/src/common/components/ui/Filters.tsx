/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTranslation } from 'react-i18next';
import { Search, Plus } from 'lucide-react';
import { 
  BalanceFilters, 
  ClientFilters, 
  TransferFilters, 
  ProductFilters, 
  PaymentLinkFilters,
  uiState, 
  uiStateClient, 
  uiStateTransfer,
  uiStateProduct,
  uiStatePaymentLink
} from '@/common/types/filtersTypes';
import { CustomSelect, SelectOption } from './CustomSelect';

interface FiltersProps {
  filters: ClientFilters | TransferFilters | BalanceFilters | ProductFilters | PaymentLinkFilters;
  setFilters: (filters: any) => void;
  uiState: uiStateClient | uiStateTransfer | uiStateProduct | uiStatePaymentLink; 
  setUiState: (state: any) => void;
}

export const Filters = ({ filters, setFilters, uiState, setUiState }: FiltersProps) => {
  const { t } = useTranslation();

  const dateRangeOptions: SelectOption[] = [
    { label: t('clients.filters.date_month'), value: 'month' },
    { label: t('clients.filters.date_quarter'), value: 'quarter' },
    { label: t('clients.filters.date_semester'), value: 'semester' },
    { label: t('clients.filters.date_year'), value: 'year' },
  ];

  const dateSortOptions: SelectOption[] = [
    { label: t('clients.filters.sort_newest'), value: 'desc' },
    { label: t('clients.filters.sort_oldest'), value: 'asc' },
  ];

  const typeOptions: SelectOption[] = [
    { label: t('clients.filters.type_customer'), value: 'customer' },
    { label: t('clients.filters.type_business'), value: 'business' },
  ];
  
  const statusOptions: SelectOption[] = [
    { label: t('clients.filters.status_completed'), value: 'Completed' },
    { label: t('clients.filters.status_pending'), value: 'Pending' },
    { label: t('clients.filters.status_rejected'), value: 'Rejected' },
  ];

  const productStatusOptions: SelectOption[] = [
    { label: t('products.status.active'), value: 'active' },
    { label: t('products.status.inactive'), value: 'inactive' },
  ];

  const isClientUiState = (state: uiState): state is uiStateClient => state.kind === 'clientUiState';
  const isTransferUiState = (state: uiState): state is uiStateTransfer => state.kind === 'transferUiState';
  const isProductUiState = (state: uiState): state is uiStateProduct => state.kind === 'productUiState';
  const isPaymentLinkUiState = (state: uiState): state is uiStatePaymentLink => state.kind === 'paymentLinkUiState';

  const toggleSection = (section: string) => {
    if (isClientUiState(uiState) && (section === 'showDate' || section === 'showType')) {
      setUiState({ ...uiState, [section]: !uiState[section] });
    } else if (isTransferUiState(uiState) && (section === 'showDate' || section === 'showStatus')) {
      setUiState({ ...uiState, [section]: !uiState[section] });
    } else if (isProductUiState(uiState) && (section === 'showDate' || section === 'showStatus')) {
      setUiState({ ...uiState, [section]: !uiState[section] });
    } else if (isPaymentLinkUiState(uiState) && (section === 'showDate' )) {
      setUiState({ ...uiState, [section]: !uiState[section] });
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      { (filters.kind === 'clientFilter' || filters.kind === 'transferFilters' || filters.kind === 'productFilter' || filters.kind === 'paymentLinkFilters') &&
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder={t('clients.searchPlaceholder')} 
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
      </div>
      }
      
      {/* Fila Inferior: Botones Filtros + Selects Condicionales */}
      <div className="flex flex-wrap items-center gap-2">
        
        {/* Boton Fecha (Disponible en casi todos) */}
        <button 
          onClick={() => toggleSection('showDate')}
          className={`flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${uiState.showDate ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-foreground hover:bg-surface-muted'}`}
        >
          <Plus size={14} className={`${uiState.showDate ? 'rotate-45' : ''} transition-all duration-300`} />
          {t('clients.filters.date')}
        </button>

        {/* Boton Estado (Transfers y Products) */}
        {(isTransferUiState(uiState) || isProductUiState(uiState)) && (
          <button 
            onClick={() => toggleSection('showStatus')}
            className={`flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${ (uiState as any).showStatus ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-foreground hover:bg-surface-muted'}`}
          >
            <Plus size={14} className={`${(uiState as any).showStatus ? 'rotate-45' : ''} transition-all duration-300`} />
            {t(isProductUiState(uiState) ? 'products.filters.status' : 'clients.filters.state')}
          </button>
        )}       

        {/* Boton Tipo (Clients) */}
        {isClientUiState(uiState) && (
          <button 
            onClick={() => toggleSection('showType')}
            className={`flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${uiState.showType ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-foreground hover:bg-surface-muted'}`}
          >
            <Plus size={14} className={`${uiState.showType ? 'rotate-45' : ''} transition-all duration-300`} />
            {t('clients.filters.type')}
          </button>
        )}

        {/* Separador vertical */}
        {(uiState.showDate || (isClientUiState(uiState) && uiState.showType) || ((isTransferUiState(uiState) || isProductUiState(uiState)) && (uiState as any).showStatus)) && (
           <div className="h-6 w-px bg-border mx-2"></div>
        )}

        {/* Selects Fecha */}
        {uiState.showDate && (
          <>
            <CustomSelect
              value={filters.dateRange}
              onChange={(val) => setFilters({...filters, dateRange: val})}
              options={dateRangeOptions}
              className="rounded-full h-8 cursor-pointer text-xs py-1"
            />
            <CustomSelect 
              value={filters.dateSort}
              onChange={(val) => setFilters({...filters, dateSort: val})}
              options={dateSortOptions}
              className="rounded-full h-8 cursor-pointer text-xs py-1"
            />
          </>
        )}

        {/* Select Tipo (Clients) */}
        {isClientUiState(uiState) && uiState.showType && (
           <CustomSelect 
             value={(filters as ClientFilters).type}
             onChange={(val) => setFilters({...filters, type: val} as ClientFilters)}
             options={typeOptions}
             className="rounded-full h-8 cursor-pointer text-xs py-1"
           />
        )}

        {/* Select Status (Transfers) */}
        {isTransferUiState(uiState) && uiState.showStatus && (
           <CustomSelect 
             value={(filters as TransferFilters).status}
             onChange={(val) => setFilters({...filters, status: val} as TransferFilters)}
             options={statusOptions}
             className="rounded-full h-8 cursor-pointer text-xs py-1"
           />
        )}

        {/* Select Status (Products) - Nuevo */}
        {isProductUiState(uiState) && uiState.showStatus && (
           <CustomSelect 
             value={(filters as ProductFilters).status}
             onChange={(val) => setFilters({...filters, status: val})}
             options={productStatusOptions}
             className="rounded-full h-8 cursor-pointer text-xs py-1"
           />
        )}

       

      </div>
    </div>
  );
};
