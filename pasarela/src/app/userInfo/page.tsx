'use client';
import { useTranslation } from 'react-i18next';
import { FilePenLine, FileText, Building2, User as UserIcon, ShoppingBag, Globe } from 'lucide-react';
import { COMPANY_DATA_FIELDS, FISCAL_DATA_FIELDS, PRODUCTS_SERVICES_FIELDS, PUBLIC_DATA_FIELDS, REPRESENTATIVE_DATA_FIELDS } from '@/lib/infoUserConstants';
import { ProgressBar } from './_components/ProgressBar';
import { InfoAccordion } from './_components/InfoAccordeon';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { FieldConfig } from '@/common/types/userInfoTypes';
import { useAuth } from '@/common/context/authContext';
import { useMemo } from 'react';
import { User } from '@/common/types/userTypes';
import { getCompletedSteps } from '@/lib/profileConstants';
import { ApprovalConfigurationSection } from './_components/ApprovalConfigurationSection';
import { AccountUsersSection } from './_components/AccountUsersSection';
import { AccountSummarySection } from './_components/AccountSummarySection';
import { AccountAuditSection } from './_components/AccountAuditSection';
import { useRbacSimulation } from '@/common/context';
import { useRouter } from 'next/navigation';



export default function UserInfoPage() {
  const { t } = useTranslation();
  const {client} = useAuth();
  const { hasPermission } = useRbacSimulation();
  const router = useRouter();
  const canManageAccountConfiguration = hasPermission('manage_account_configuration');
  const verifySteps = useMemo(()=>{
    if(client){
     const completedSteps = getCompletedSteps(client);
     return completedSteps.length;
    }
    return 0
  },[client])
  
  const USER_DATA: User = useMemo(()=>{
    if(!client) return {} as User;
    return client
  },[client])
  


  return (
    <div className='lg:flex h-full min-h-0 overflow-hidden animate-enter-step'>
        <Navbar/>
        <div className='min-w-0 flex-1 min-h-0 flex flex-col bg-surface'>
            <Header/>
            <div className='flex-1 min-h-0 overflow-y-auto p-4 md:p-8 animate-enter-step'>
                <div className="bg-background">
                    <div className="p-6 md:p-12 max-w-5xl mx-auto">
                        <div className="mb-8">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground mb-2">
                                        {t('userInfo.title')}
                                    </h1>
                                    <p className="text-muted-foreground">
                                        {t('userInfo.subtitle')}
                                    </p>
                                </div>
                                {canManageAccountConfiguration ? (
                                    <button
                                        type="button"
                                        onClick={() => router.push('/profile')}
                                        className="inline-flex items-center gap-2 self-start rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
                                    >
                                        <FilePenLine size={16} />
                                        Editar información de la cuenta
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        <ProgressBar
                            completedSteps={verifySteps} 
                            totalSteps={5} 
                            status={client?.validated}
                        />

                        <div className="space-y-4">
                            <AccountSummarySection />
                            <ApprovalConfigurationSection />
                            <AccountUsersSection />
                            <AccountAuditSection />

                            <InfoAccordion 
                            title={t('userInfo.fiscalDataTitle')}
                            icon={FileText}
                            fields={FISCAL_DATA_FIELDS as unknown as  FieldConfig[]}
                            data={USER_DATA}
                            defaultOpen={true}
                            />

                            <InfoAccordion 
                            title={t('userInfo.companyDataTitle')}
                            icon={Building2}
                            fields={COMPANY_DATA_FIELDS as unknown as FieldConfig[]}
                            data={USER_DATA}
                            defaultOpen={true}
                            />

                            <InfoAccordion 
                            title={t('userInfo.repDataTitle')}
                            icon={UserIcon}
                            fields={REPRESENTATIVE_DATA_FIELDS as unknown as FieldConfig[]}
                            data={USER_DATA}
                            defaultOpen={true}
                            />

                            <InfoAccordion 
                            title={t('userInfo.productsDataTitle')}
                            icon={ShoppingBag}
                            fields={PRODUCTS_SERVICES_FIELDS as unknown as FieldConfig[]}
                            data={USER_DATA}
                            defaultOpen={true}
                            />

                            <InfoAccordion 
                            title={t('userInfo.publicDataTitle')}
                            icon={Globe}
                            fields={PUBLIC_DATA_FIELDS as unknown as FieldConfig[]}
                            data={USER_DATA}
                            defaultOpen={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
