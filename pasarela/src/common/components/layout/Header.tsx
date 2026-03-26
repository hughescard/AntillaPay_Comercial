'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Settings, 
  Plus,
  Info, 
} from 'lucide-react';
import { CreateMenu } from '../ui/CreateMenu';
import { businessName } from '@/lib/ourInfo';
import Image from 'next/image';
import Link from 'next/link';
import { MockUserSwitcher } from '../ui/MockUserSwitcher';
import { createItems } from '@/lib/createData';
import { useRbacSimulation } from '@/common/context';


export const Header = () => {
  const { t } = useTranslation();  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { hasPermission } = useRbacSimulation();
  const canCreateAnything = createItems.some((item) => hasPermission(item.permission));

  return (
    <header className="sticky lg:flex hidden top-0 z-30  w-full items-center justify-between border-b border-border bg-surface py-3 px-4 transition-colors">
      
      {/* IZQUIERDA: LOGO (Reemplazando barra de búsqueda) */}
      <div className="flex items-center">
        <div className="flex items-center gap-2 font-bold text-lg text-foreground tracking-tight">
          <div className="h-11 w-11 flex items-center justify-center">
            <Image
              src="/pasarela/logo.png"
              alt="AntillaPay Logo"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <span>{businessName}</span>
        </div>
      </div>

      {/* DERECHA: Acciones */}
      <div className="flex items-center gap-2 ml-4">
        <MockUserSwitcher />

        {/* CONTENEDOR BOTÓN CREAR (+) CON MENÚ */}
        {canCreateAnything ? (
        <div className="relative">
          <button 
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className={`
              flex h-10 w-10 items-center justify-center rounded-lg cursor-pointer
              text-accent-foreground shadow-sm transition-all duration-200
              ${isCreateOpen ? 'bg-accent-hover' : 'bg-accent hover:bg-accent-hover'}
            `}
            title={t('header.create')}
          >
            <Plus size={16} strokeWidth={3} className={` ${isCreateOpen ? 'rotate-45' : ''} transition-all`}/>
          </button>

          {/* Menú Desplegable con Animación */}
          <CreateMenu
            isOpen={isCreateOpen} 
            onClose={() => setIsCreateOpen(false)} 
          />
        </div>
        ) : null}

        <Link 
          href={'/userInfo'} 
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
          aria-label={t('header.userInfo')}
        >
            <Info size={18} />
        </Link>

        {/* Guía de Configuración */}
       {/* <button className="hidden lg:flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-2 cursor-pointer text-xs font-semibold text-muted-foreground hover:bg-surface-strong transition-colors">
          <span>{t('header.configurationGuide', 'Guía de configuración')}</span>
        </button>*/}

      </div>
    </header>
  );
};
