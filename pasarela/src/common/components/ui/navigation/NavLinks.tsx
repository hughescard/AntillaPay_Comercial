'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { navItems } from '@/lib/navData';
import { useRbacSimulation } from '@/common/context';
import { normalizeAppPathname } from '@/lib/rbac/normalizePathname';

interface NavLinksProps {
  isNavBarCollapsed?: boolean;
  onNavigate?: () => void;
}

interface TooltipState {
  label: string;
  top: number;
  left: number;
}

export const NavLinks = ({ isNavBarCollapsed = false, onNavigate }: NavLinksProps) => {
  const pathname = usePathname();
  const normalizedPathname = normalizeAppPathname(pathname);
  const { t } = useTranslation();
  const { hasPermission } = useRbacSimulation();
  
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const visibleNavItems = navItems.filter((item) => hasPermission(item.permission));

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, labelKey: string) => {
    if (!isNavBarCollapsed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      label: labelKey as TooltipState['label'],
      top: rect.top + rect.height / 2, 
      left: rect.right +10, 
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <>
      <div className="flex flex-col gap-1 px-3 py-2">
        {visibleNavItems.map((item) => {
          const isActive = normalizedPathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              onMouseEnter={(e) => handleMouseEnter(e, item.label)}
              onMouseLeave={handleMouseLeave}
              className={`
                group relative flex items-center rounded-md px-3 py-2 text-sm text-nowrap font-medium transition-colors duration-200
                ${isActive 
                  ? 'text-[var(--accent)]' 
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]'}
              `}
            >
              <item.icon 
                  className={`
                    ${isActive && isNavBarCollapsed ? 'bg-[var(--accent-soft)] p-1.5 h-8 w-8 -ml-1 hover:scale-120' : 'h-5 w-5'} 
                    rounded-sm flex-shrink-0 transition-all duration-300 
                    ${!isActive && isNavBarCollapsed ? 'mr-0 ml-0.5' : 'mr-3'}
                  `} 
              />
            
              <span 
                className={`overflow-hidden transition-all duration-300 ${
                  isNavBarCollapsed ? 'hidden' : 'flex'
                }`}
              >
                {t(item.label)}
              </span>
              
            </Link>
          );
        })}
      </div>

      
            {isNavBarCollapsed && tooltip && (
              <div 
                className="
                  fixed z-50 px-3 py-1.5
                  bg-[var(--tooltip-bg)] text-[var(--accent-foreground)] text-sm font-medium rounded-md shadow-xl
                  pointer-events-none animate-in fade-in zoom-in-95 duration-200
                "
                style={{ 
                  top: tooltip.top, 
                  left: tooltip.left,
                  transform: 'translateY(-50%)' 
                }}
              >
                {t(tooltip.label as never)}
                
                <div className="absolute top-1/2 right-full -mt-1 -mr-px border-4 border-transparent border-r-[var(--tooltip-bg)]" />
              </div>
            )}
    </>
  );
};
