'use client';

import { useState } from 'react';
import { Info, Menu, Plus } from 'lucide-react';
import { DesktopSidebar } from './navigation/DesktopSidebar';
import { MobileMenu } from './navigation/MobileMenu';
import { useTranslation } from 'react-i18next';
import { TOKEN_KEY, useAuth } from '@/common/context/authContext';
import { ProfileModal } from './navigation/ProfileModal';
import { SandboxOutModal } from './navigation/SandBoxOutModal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreateMenu } from './CreateMenu';
import { useEnvironment } from '@/common/context/environmentContext';
import { useRbacSimulation } from '@/common/context';

export const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSandboxModalOpen,setIsSandBoxModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { t } = useTranslation();
  const { client, getMyInfo } = useAuth();
  const { account, currentUser } = useRbacSimulation();
  const {setEnvironment} = useEnvironment();
  const businessName:string = account.name;
  const userName = currentUser.name; 
  const push = useRouter().push;

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    getMyInfo();
  }

  const handleOutOfSandbox = ()=>{
    if(client && client?.validated == 'true'){
      setEnvironment('production');
    }else{
      setIsSandBoxModalOpen(true); 
    }
  }

  const handleEnterOfSandbox = () =>{
    setEnvironment('sandbox');
  }

  return (
    <>
    <div className='relative'>
      {/* 1. Mobile/Tablet Top Bar (Visible solo < lg) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-surface-muted hover:cursor-pointer"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-foreground">{t('nav.home')}</span>
        </div>
        
        <div className='flex gap-2'>
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

          <Link 
            href={'/userInfo'} 
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
            aria-label={t('header.userInfo')}
          >
              <Info size={18} />
          </Link>
        </div>
      </header>

      {/* 2. Desktop Sidebar (Visible >= lg) */}
      <DesktopSidebar 
        isModalOpen={isModalOpen}
        setIsModalOpen={(value)=>setIsModalOpen(value)}
      />

      {/* 3. Mobile/Tablet Menu Logic */}
      <MobileMenu 
        isOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)}
        isModalOpen={isModalOpen}
        setIsModalOpen={(value)=>setIsModalOpen(value)}
      />
      <ProfileModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        businessName={businessName}
        userName={userName}
        onOutSandBox={()=>handleOutOfSandbox()}
        onEnterSandBox={()=>handleEnterOfSandbox()}
        onLogout={()=>handleLogout()}
      />
    </div>
    <SandboxOutModal
      isOpen={isSandboxModalOpen}
      onClose={()=>setIsSandBoxModalOpen(false)}
      onConfirm={()=>push('/profile')}
    />
    </>
  );
};
