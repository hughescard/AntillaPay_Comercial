'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SidebarTogglerProps {
  isNavBarCollapsed: boolean;
  toggle: () => void;
  isHovered:boolean;
  setIsHovered:(value:boolean)=>void;
}

export const SidebarToggler = ({ isNavBarCollapsed, toggle, isHovered, setIsHovered }: SidebarTogglerProps) => {
  const { t } = useTranslation();
  return (
    <div 
      className={`absolute -right-9 top-1/2 z-50 flex transition-all  h-12 -translate-y-1/2 cursor-pointer items-center 
        justify-center w-12`}
      onClick={toggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* CONTENEDOR DE LA FLECHA */}
      <div className="flex flex-col items-center justify-center gap-0">
        
        {/* LÍNEA SUPERIOR */}
        <span 
          className={`
            h-3 w-0.5 rounded-full bg-[var(--subtle-foreground)]
            transition-all duration-200 ease-out 
            
            origin-top
            
            ${isHovered 
              ? (isNavBarCollapsed ? '-rotate-45 translate-x-[0.5px] translate-y-1' : 'rotate-45 -translate-x-[0.5px] translate-y-1') 
              : 'rotate-0 translate-y-0.5'
            }
          `}
        />

        {/* LÍNEA INFERIOR */}
        <span 
          className={`
            h-3 w-0.5 rounded-full bg-[var(--subtle-foreground)]
            transition-all duration-200 ease-out 
            
            origin-bottom
            

            ${isHovered 
              ? (isNavBarCollapsed ? 'rotate-45 translate-x-[0.5px] -translate-y-1' : '-rotate-45 -translate-x-[0.5px] -translate-y-1') 
              : 'rotate-0'
            }
          `}
        />
      </div>

      <div 
        className={`
          absolute left-full ml-4 px-3 py-1.5
          bg-[var(--tooltip-bg)] text-[var(--accent-foreground)] text-sm font-medium rounded-md shadow-xl whitespace-nowrap
          pointer-events-none 
          transition-all duration-200 ease-out origin-left
          ${isHovered ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 -translate-x-2'}
        `}
      >
        {isNavBarCollapsed ? t('nav.expand') : t('nav.collapse')}
        <div className="absolute top-1/2 right-full -mt-1 -mr-px border-4 border-transparent border-r-[var(--tooltip-bg)]" />
      </div>
    </div>
  );
};
