'use client';

import { X, ChevronsUpDown } from 'lucide-react';
import { NavLinks } from './NavLinks';
import { useTranslation } from 'react-i18next';
// Importamos los nuevos componentes
import { ShortcutsSection } from './ShortcutsSection'; 
import { SidebarProductsSection } from './SidebarProductsSection';
import { SidebarDevelopersSection } from './SidebarDevelopersSection';
import { UserProfile } from './UserProfile';
import { useCurrentRoleLabel, useRbacSimulation } from '@/common/context';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isModalOpen:boolean;
  setIsModalOpen:(value:boolean)=>void;
}

export const MobileMenu = ({ isOpen, onClose, isModalOpen, setIsModalOpen }: MobileMenuProps) => {
  const { t } = useTranslation();
  const { account, currentUser } = useRbacSimulation();
  const roleLabel = useCurrentRoleLabel();
  const loading = false;
  
  const businessName:string = account.name;
  const initials = businessName.slice(0, 2).toUpperCase();

  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-overlay transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-surface shadow-xl transition-transform duration-300 ease-in-out
          w-[85vw] max-w-[320px] md:w-[320px] 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button 
            onClick={onClose} 
            className="text-subtle-foreground hover:bg-surface-muted p-2 -ml-2 rounded-md transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="w-8" /> 
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-10">
          
          <UserProfile
            isNavBarCollapsed={false}
            initials={initials}
            businessName={businessName}
            userName={currentUser.name}
            roleLabel={roleLabel}
            isModalOpen={isModalOpen}
            setIsModalOpen={(value) => setIsModalOpen(value)}
            loading={loading}
          />

          <div className="border-t border-divider mb-4 mx-2" />

          
          <div className="-mx-2">
             <NavLinks onNavigate={onClose} />
          </div>

         
          <div className="-mx-2">
             <ShortcutsSection onNavigate={onClose} isCollapsed={false} />
          </div>

          
          <div className="-mx-2">
             <SidebarProductsSection onNavigate={onClose} isNavBarCollapsed={false} />
          </div>

          {!(currentUser.roles.length === 1 && currentUser.roles.includes('developer')) && (
            <div className="-mx-2">
               <SidebarDevelopersSection onNavigate={onClose} isNavBarCollapsed={false} />
            </div>
          )}

        </div>
      </div>
    </>
  );
};
