'use client';

import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/common/context/authContext';
import { useEnvironment } from '@/common/context/environmentContext';

export type AccountStatus = 'true' | 'false' | 'pending' ;


export const SandboxHeader = () => {
  const { t } = useTranslation();
  const {client} = useAuth();
  const {environment,setEnvironment} = useEnvironment();
  const accountStatus = client?.validated || 'false'; 

  const bgColors: Record<AccountStatus, string> = {
    false: 'bg-status-restricted',
    pending: 'bg-status-review',
    true: 'bg-status-active',
  };
  
  const showCompleteProfile = accountStatus === 'false';
  const showContactSupport = accountStatus === 'pending';
  const showOutSandbox = accountStatus === 'true';

  return (
    <div 
      className={`
        w-full px-5 py-3 flex flex-row items-start sm:items-start justify-between ${environment === 'production' && 'hidden'}
        text-accent-foreground text-xs sm:text-sm font-sans transition-colors duration-300
        ${bgColors[accountStatus]}
      `}
    >
        <span className="font-bold text-nowrap">
          {t(`sandBox.status`)}
        </span>

      {/* Sección Izquierda: Título y Descripción */}
      <div className=" items-center gap-1.5 duration-200 transition-opacity hidden md:flex w-0 opacity-0 lg:opacity-100 md:w-auto">
        
        <span className="opacity-90 font-medium">
          {t(`sandBox.description.${accountStatus}`)}
        </span>
      
      </div>

      {/* Sección Derecha: Enlace de acción */}
      {showCompleteProfile && (
        <Link 
          href="/profile" 
          className="flex items-center gap-1 font-bold hover:underline opacity-100 whitespace-nowrap"
        >
          {t('sandBox.action.link_complete')}
          <ExternalLink size={12} strokeWidth={3} />
        </Link>
      )}

      {showContactSupport && (
        <Link 
          href="#" 
          className="flex items-center gap-1 font-bold hover:underline opacity-100  whitespace-nowrap"
        >
          {t('sandBox.action.link_contact')}
          <ExternalLink size={12} strokeWidth={3} />
        </Link>
      )}

      {showOutSandbox && (
        <button 
          onClick={()=>setEnvironment('production')}
          className="flex items-center gap-1 font-bold hover:underline opacity-100  whitespace-nowrap"
        >
          {t('sandBox.action.link_out_sandbox')}
          <ExternalLink size={12} strokeWidth={3} />
        </button>
      )}
    </div>
  );
};