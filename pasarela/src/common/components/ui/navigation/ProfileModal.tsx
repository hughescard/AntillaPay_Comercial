'use client';

import { useTranslation } from 'react-i18next';
import { User, LogOut, Info } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/common/context/authContext';
import { useEnvironment } from '@/common/context/environmentContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  businessName: string;
  userName: string;
  onOutSandBox:()=>void;
  onEnterSandBox:()=>void;
}

export const ProfileModal = ({ isOpen, onClose, businessName, userName, onOutSandBox, onEnterSandBox, onLogout }: ProfileModalProps) => {
  const { t } = useTranslation();
  const {client} = useAuth();
  const {environment} = useEnvironment();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      onClose(); 
    }, 200);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); 

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={`
        fixed right-3 top-18 sm:right-4 sm:top-20 lg:right-4 lg:top-18
        w-[min(24rem,calc(100vw-1.5rem))] 
        bg-surface border border-border rounded-xl shadow-xl z-[200] overflow-hidden 
        transform transition-all duration-200 ease-in-out
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}
      style={{ transformOrigin: 'top right' }}
    >
      {/* Header con Iniciales */}
      <div className="p-4 flex flex-col items-center justify-center border-b border-border bg-surface-muted/30">
        <div className="w-12 h-12 bg-surface-strong rounded-lg flex items-center justify-center text-muted-foreground mb-3 font-bold text-lg">
          {businessName.slice(0, 2).toUpperCase()}
        </div>
        <p className="text-sm font-medium text-foreground">{businessName}</p>
        <p className="text-xs text-muted-foreground">{t('profile.test_env')}</p>
      </div>

      {/* Acciones */}
      <div className="p-2 space-y-1">
        {environment === 'sandbox' &&
        <button 
          onClick={()=>{onOutSandBox(); handleClose();}}
          hidden={client?.validated === 'pending'}
          className="w-full text-center px-3 py-2 text-sm text-foreground hover:bg-surface-muted rounded-md transition-colors border border-border bg-surface shadow-sm mb-2 cursor-pointer"
        >
          {t('profile.exit_test_env')}
        </button>
        }
        {environment === 'production' && 
        <button 
          onClick={()=>{onEnterSandBox(); handleClose();}}
          hidden={client?.validated === 'pending'}
          className="w-full text-center px-3 py-2 text-sm text-foreground hover:bg-surface-muted rounded-md transition-colors border border-border bg-surface shadow-sm mb-2 cursor-pointer"
        >
          {t('profile.enter_test_env')}
        </button>
        }
        <Link 
          href={'/userInfo'}
          onClick={handleClose}
          className="flex items-center gap-3 w-full min-w-0 px-3 py-2 text-sm text-foreground hover:bg-surface-muted rounded-md transition-colors cursor-pointer"
        >
          <Info size={16} className="text-muted-foreground" />
          {t('profile.settings')}
        </Link>

        <div className="h-px bg-border mx-2 my-1 opacity-50" />

        <div className="flex items-center gap-3 w-full min-w-0 px-3 py-2 text-sm text-foreground">
          <User size={16} className="text-muted-foreground" />
          <span className="truncate font-medium">{userName}</span>
        </div>

        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-danger hover:bg-danger-surface rounded-md transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          {t('profile.logout')}
        </button>
      </div>
    </div>
  );
};
