/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { Skeleton } from '@mui/material';
import { GenericTable } from '@/common/components/ui/GenericTable';
import { Filters } from '@/common/components/ui/Filters';
import { BalanceFilters, uiState as uiStateTransaction, uiStateTransfer } from '@/common/types/filtersTypes';
import { pagination } from '@/common/types/pagination';
import { BalanceSummary } from './_components/BalanceSummary';
import { WithdrawalModal } from './_components/WithdrawalModal';
import { dataBalance } from '@/common/types/balanceTypes';
import { useBalance } from './_hooks/useBalance';
import { bankAccount } from '@/common/types/bankAccount';
import { AddBankAccountModal } from './_components/AddBankAccountModal';
import { useAuth } from '@/common/context/authContext';
import { useRbacSimulation } from '@/common/context';


interface data {
  id:string,
  amount: string,
  currency: string,
  status: string,
  method: string,
  createdAt:string,
}



const WITHDRAWAL_COLUMNS = [
  { key: 'date', label: 'withdrawals.table.col_date', visible: true, order: 1 },
  { key: 'amount', label: 'withdrawals.table.col_amount', visible: true, order: 2 },
  { key: 'status', label: 'withdrawals.table.col_status', visible: true, order: 3 },
];


export default function BalancesPage() {
  const { t } = useTranslation();
  const {client} = useAuth();
  const { hasPermission } = useRbacSimulation();
  const canWithdrawFunds = hasPermission('withdraw_funds');
  const canManageBankAccounts = hasPermission('manage_bank_accounts');

  const { getPayouts, getBanksAccounts,postBankAccount, postBankAccountExtract} = useBalance();
  const [data, setData] = useState<data[]>(); 
  const [dataBanks,setBanksData] = useState<bankAccount[]>([])
  const [loading, setLoading] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [pagination, setPagination] = useState<pagination>();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bankAccountModalIsOpen, setBankAccountModal] = useState(false);

  const dataBalance: dataBalance = useMemo(() => {
    if (!client) return { available: 0, pending: 0, total: 0 };
    return {
      available: Number(client.grossBalance)/100,
      pending: (Number(client.netBalance) - Number(client.grossBalance))/100,
      total: Number(client.netBalance)/100
    };
  }, [client]);


  const [filters, setFilters] = useState<BalanceFilters>({
    kind: 'balanceFilters',
    dateRange: 'month',
    dateSort: 'desc',
    status: 'Completed'
  });

  const [uiState, setUiState] = useState<uiStateTransaction>({
    kind: 'transferUiState',
    showDate: false,
    showStatus: false, 
  });

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

  const handleAddBankAccount = async (data:{bankName:string,accountNumber:string,currency:string,representativeId:string,representativeName:string}) =>{
    const response1 = await postBankAccount(data);
    const response2 = await getBanksAccounts();
  
    
    if(response1.success && response2.success){
      setBanksData(response2.data);
      setBankAccountModal(false);
    }else{
      setBankAccountModal(false);
      setIsWithdrawModalOpen(false);
    }

  }

  useEffect(()=>{
    const fetchDataBanks = async () =>{
      const response = await getBanksAccounts();
      if(response.success){
        setBanksData(response.data)
      }
    }

    fetchDataBanks();
  },[])

  useEffect(() => {
    const fetchData = async () => {
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
        status: (uiState as uiStateTransfer).showStatus ? filters.status as 'Completed' | 'Pending' | 'Rejected' : null,
        months: months,
        page:currentPage
    }  

      const response = await getPayouts(params);
      if(response.success){
        setData(response.data);
        setPagination(response.pagination);
        setCurrentPage(response.pagination.page);
      }
      
      setLoading(false);
    };
    fetchData();
  }, [filters.dateRange, filters.status, uiState, currentPage]);

  const renderCell = (item: data, key: string) => {
    switch(key) {
      case 'date': return <span className="text-sm text-foreground">{item.createdAt.split('T')[0]}</span>;
      case 'amount': return <span className="font-bold text-foreground">{(Number(item.amount)/100).toFixed(2)} {item.currency}</span>;
      case 'status':
        const colors: Record<string, string> = {
          Completed: 'bg-green-100 text-green-700 border border-green-300',
          Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
          Rejected: 'bg-red-100 text-red-700 border border-red-300'
        };
        return (
          <span className={`px-2.5 py-1  rounded-full text-xs font-medium ${colors[item.status]}`}>
            {t(`withdrawals.status.${item.status as 'Completed' | 'Rejected' | 'Pending'}`)}
          </span>
        );
    }
  };

  return (
    <div className='lg:flex h-full min-h-0 overflow-hidden animate-enter-step'>
        <Navbar/>
        <div className='min-w-0 flex-1 min-h-0 flex flex-col'>
            <Header/>
            <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6 mx-auto w-full">
                
                {/* 1. SECCIÓN RESUMEN SALDOS */}
                <BalanceSummary
                  available={dataBalance ? dataBalance.available : 0} 
                  incoming={dataBalance ? dataBalance.pending : 0} 
                  currency={'USD'}
                  onExtract={() => canWithdrawFunds && setIsWithdrawModalOpen(true)}
                  extractDisabled={!canWithdrawFunds}
                  loading={loadingBalance}
                  total={dataBalance ? dataBalance.total : 0}
                />

                <div className="h-px w-full bg-border my-8" />

                {/* 2. PESTAÑAS */}
                <div className="flex gap-6 border-b border-border mb-6">
                    <button className="pb-3 text-sm font-medium border-b-2 border-accent text-accent">
                        {t('balances.tabs.withdrawals')}
                    </button>
                </div>

                {/* 3. FILTROS */}
                <Filters
                    filters={filters} 
                    setFilters={(val) => setFilters(val as BalanceFilters)} 
                    uiState={uiState} 
                    setUiState={(val) => setUiState(val as uiStateTransaction)} 
                />

                {/* 4. INFO TABLA */}
                <div className="flex justify-between items-end mb-3 mt-4">
                    <span className="text-sm text-muted-foreground">
                        {t('transactions.table.total_showing', { count: filteredData.length })}
                    </span>
                </div>

                {/* 5. TABLA */}
                {loading ? 
                    <Skeleton animation='wave' width={"100%"} height={150}/>
                :
                (filteredData.length > 0 ?
                    <GenericTable
                      hideMenu={true}
                        data={filteredData}
                        columns={WITHDRAWAL_COLUMNS}
                        renderCellContent={renderCell}
                    />
                : 
                    <p className='w-full text-center py-8 text-muted-foreground'>{t('common.resultsNotFound')}</p>
                )
                }

                {/* 6. PAGINACIÓN */}
                <div className="flex justify-end items-center gap-4 mt-4">
                    <span className="text-sm text-muted-foreground">
                        {t('transactions.table.page_count', { current: currentPage, total: pagination?.pages || 0 })}
                    </span>
                    <div className="flex gap-1">
                        <button  
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-md border border-border bg-surface text-muted-foreground disabled:opacity-50">
                            <ChevronLeft size={16} />
                        </button>
                        <button 
                        onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
                        disabled={currentPage === pagination?.pages}
                        className="p-1.5 rounded-md border border-border bg-surface text-muted-foreground disabled:opacity-50">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* MODAL */}
                <WithdrawalModal 
                  isOpen={isWithdrawModalOpen} 
                  onClose={() => setIsWithdrawModalOpen(false)}
                  availableAmount={dataBalance ? dataBalance.available : 0}
                  banks={dataBanks}
                  onAddAccount={()=>canManageBankAccounts && setBankAccountModal(true)}
                  canAddAccount={canManageBankAccounts}
                  canConfirm={canWithdrawFunds}
                  onConfirm={(data:{amount:number,accountId:string})=>postBankAccountExtract(data)}
                />
                <AddBankAccountModal
                  isOpen={bankAccountModalIsOpen}
                  onClose={()=>setBankAccountModal(false)}
                  onSave={(data:{bankName:string,accountNumber:string,currency:string,representativeId:string,representativeName:string})=> handleAddBankAccount(data)}
                />
            </div>
        </div>
    </div>
  );
}
