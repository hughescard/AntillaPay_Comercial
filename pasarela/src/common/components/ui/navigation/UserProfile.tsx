'use client';

import { ChevronDown } from 'lucide-react';
import { Skeleton } from '@mui/material';

interface UserProfileProps {
  isNavBarCollapsed?: boolean;
  businessName:string;
  userName: string;
  roleLabel: string;
  initials:string;
  isModalOpen:boolean;
  setIsModalOpen:(value:boolean)=>void;
  loading:boolean;
}

export const UserProfile = ({ isNavBarCollapsed, businessName, userName, roleLabel, initials, isModalOpen, setIsModalOpen,loading }: UserProfileProps) => {
  
  return (
    <div className={`mb-4 px-3 mt-4 ${isNavBarCollapsed ? 'flex justify-center' : ''}`}>

      <button
        disabled={loading}
        onClick={() => setIsModalOpen(!isModalOpen)}
        className={`
          flex w-full cursor-pointer items-center rounded-lg border border-transparent p-2 text-left transition-all hover:bg-surface-muted
          ${isNavBarCollapsed ? 'justify-start' : 'justify-between'}
          ${isModalOpen ? 'bg-surface-muted' : ''}
        `}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {loading ? (
            <Skeleton animation="wave" variant="rounded" width={32} height={32} />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-strong text-muted-foreground border border-border">
              <span className="text-xs font-bold">{initials}</span>
            </div>
          )}

          <div
            className={`flex flex-col overflow-hidden transition-all duration-300 ${
              isNavBarCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'
            }`}
          >
            <span className="truncate text-sm font-semibold text-foreground">
              {loading ? <Skeleton width={80} /> : businessName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {loading ? <Skeleton width={110} /> : `${userName} · ${roleLabel}`}
            </span>
          </div>
        </div>

        {!isNavBarCollapsed && !loading && (
          <ChevronDown 
            size={16} 
            className={`text-subtle-foreground transition-transform duration-200 ${isModalOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>
    </div>
  );
};
