'use client';

import { useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AccordionMenuProps {
  label: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  maxHeight?: string; 
  className?: string; 
  iconClassName?: string;
  isDisabled?: boolean; 
}

export const AccordionMenu = ({
  label,
  icon: Icon,
  children,
  maxHeight = "300px", 
  className = "",
  iconClassName = "h-5 w-5",
  isDisabled = false
}: AccordionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const isExpanded = isOpen && !isDisabled;

  const toggle = () => {
    if (isDisabled) return; 
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col">
      {/* 1. EL BOTÓN (HEADER) */}
      <button
        type="button"
        onClick={toggle}
        className={`
          group flex w-full items-center justify-between transition-colors duration-200
          ${className} 
          ${isDisabled ? 'px-4' : ''}
        `}
        title=""
        aria-label={isDisabled ? undefined : t(label as never)}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {Icon && (
            <Icon 
              className={`
                 flex-shrink-0 transition-all duration-300
                 ${iconClassName}
                 ${isDisabled ? 'mr-0' : ''} 
              `} 
            />
          )}
          
          <span 
            className={`
              whitespace-nowrap font-medium transition-all duration-300
              ${isDisabled ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}
            `}
          >
            {t(label as never)}
          </span>
        </div>

        {!isDisabled && (
          <ChevronDown
            size={16}
            className={`
              text-[var(--subtle-foreground)] transition-transform duration-300 ease-in-out
              ${isExpanded ? 'rotate-180' : 'rotate-0'}
            `}
          />
        )}
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? maxHeight : '0px',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div className="pt-1 pb-2">
            {children}
        </div>
      </div>
    </div>
  );
};
