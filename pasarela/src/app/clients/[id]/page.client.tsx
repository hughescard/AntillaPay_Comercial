'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { ClientHeader } from './_components/ClientHeader';
import { ClientBasicInfo } from './_components/ClientBasicInfo';
import { HistoryTable } from './_components/HistoryTable';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { useEffect, useState } from 'react';
import { useCustomers } from '../_hooks/useCustomers';
import { ClientData  } from '@/common/types/clientsTypes';
import { Skeleton } from '@mui/material';
import { Operation } from '@/common/types/operation';
import { PayinHistory } from '@/common/types/payin';


export default function ClientDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const routeId = params.id as string | undefined;
  const id = searchParams.get('id') ?? routeId ?? '';
  const {getCustomerById, getOperationsById} = useCustomers();
  const [loadingClientData,setLoadingClientData] = useState(true);
  const [loadingOperations,setLoadingOperations] = useState(true);
  const [client,setClient] = useState<ClientData>({
    id: '',
    name: '',
    businessName: '',
    email: '',
    createdAt: '',
    type: "customer",
  });
  const [operations,setOperations] = useState<Operation[]>([{
    id: '',
    businessId: '',
    amount: '',
    currency: '',
    status: 'Pending',
    declineReason: '',
    completedAt: '',
    rejectedAt: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  }]);
  const [currentPage,setCurrentPage] = useState<number>(1);
  const [totalPages,setTotalPages] = useState<number>(0)
 

  useEffect(()=>{
    const fetchData = async () => {
      setLoadingClientData(true);
      const response = await getCustomerById({id:id});
      if(response.success){
        setClient(response.data);
      }
      setLoadingClientData(response.data);
      setLoadingClientData(false);
    }
    fetchData();
  },[getCustomerById, id])

  useEffect(()=>{
    const fetchClientOperations = async () => {
      setLoadingOperations(true);
      const response = await getOperationsById({id:id,page:currentPage});
      if(response.success){
        const operations = response.data.map((payin:PayinHistory)=>payin.Operation);
        setOperations(operations);
        setTotalPages(response.paginaton.pages)
      }
      setLoadingOperations(response.data);
      setLoadingOperations(false);
    }
    fetchClientOperations();
  },[currentPage, getOperationsById, id])

  return (
    <div className='lg:flex h-full min-h-0 overflow-hidden animate-enter-step'>
        <Navbar/>

        <div className="min-w-0 flex-1 min-h-0 flex flex-col bg-surface">
            <Header/>
            <div className='flex-1 min-h-0 overflow-y-auto p-6'>
            
              <ClientHeader 
              name={client.name}
              email={client.email}
              companyName={client?.businessName}
              id={client.id}
              createdAt={client.createdAt}
              loading={loadingClientData || client.id == ''}
              />
                
             
              {(!loadingClientData || client.id != '') ?
              <ClientBasicInfo 
              name={client.name}
              email={client.email}
              createdAt={client.createdAt}
              type={client.type}
              />
              :
              <Skeleton width={"100%"} height={200} animation="wave"/>
              }
              
              {!loadingOperations || operations[0].id != '' ? 
              <HistoryTable 
                operations={operations}
                currentPage={currentPage}
                setCurrentPage={(value)=>setCurrentPage(value)}
                totalPages={totalPages}
              />
              :
              <Skeleton width={"100%"} height={200} animation="wave"/>
              } 
            </div>
        </div>
    </div>
  );
}
