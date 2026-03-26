'use client';

import { useState } from 'react';
import { NavLinks } from './NavLinks';
import { UserProfile } from './UserProfile';
import { SidebarToggler } from './SidebarToggler';
import { SidebarProductsSection } from './SidebarProductsSection';
import { SidebarDevelopersSection } from './SidebarDevelopersSection';
import { useCurrentRoleLabel, useRbacSimulation } from '@/common/context';

interface Props{
  isModalOpen:boolean;
  setIsModalOpen:(value:boolean)=>void;
}

export const DesktopSidebar = ({isModalOpen,setIsModalOpen}:Props) => {
  const [isNavBarCollapsed, setIsNavBarCollapsed] = useState(false);
  const [isbuttonHovered,setIsButtonHovered] = useState(false);
  const { account, currentUser } = useRbacSimulation();
  const roleLabel = useCurrentRoleLabel();
  const loading = false;
  const businessName:string = account.name;
  const initials = businessName.slice(0, 2).toUpperCase();

  return (
    <aside
      className={`
        hidden lg:sticky lg:top-0 lg:z-[80] lg:flex relative h-full min-h-0 shrink-0 self-start flex-col border-r border-border bg-surface
        transition-all duration-300 ease-in-out
        ${isNavBarCollapsed ? (isbuttonHovered ? 'w-22.5' : 'w-21.25') : (isbuttonHovered ? 'w-58.75' : 'w-60')}
      `}
    >
      <SidebarToggler 
        isNavBarCollapsed={isNavBarCollapsed} 
        toggle={() => setIsNavBarCollapsed(!isNavBarCollapsed)} 
        isHovered={isbuttonHovered}
        setIsHovered={(value:boolean)=>setIsButtonHovered(value)}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-visible">
        <UserProfile
          isNavBarCollapsed={isNavBarCollapsed}
          initials={initials}
          businessName={businessName}
          userName={currentUser.name}
          roleLabel={roleLabel}
          isModalOpen={isModalOpen}
          setIsModalOpen={(value) => setIsModalOpen(value)}
          loading={loading}
        />

        <NavLinks isNavBarCollapsed={isNavBarCollapsed} />
        <SidebarProductsSection isNavBarCollapsed={isNavBarCollapsed} />
        </div>

        {!(currentUser.roles.length === 1 && currentUser.roles.includes('developer')) && (
          <div className="shrink-0 border-t border-border/70 bg-surface">
            <SidebarDevelopersSection isNavBarCollapsed={isNavBarCollapsed} footerMode />
          </div>
        )}
      </div>

    </aside>
  );
};
