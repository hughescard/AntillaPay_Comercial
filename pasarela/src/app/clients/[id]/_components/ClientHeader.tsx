'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, User, Copy, Check } from 'lucide-react';
import { Skeleton } from '@mui/material';

interface ClientHeaderProps {
  name: string;
  email: string;
  companyName?: string;
  id: string;
  createdAt: string;
  loading: boolean;
}

export const ClientHeader = ({ name, email, companyName, id, createdAt, loading }: ClientHeaderProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);


  const handleCopyId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="mb-8">
      {/* Breadcrumb / Back Link */}
      <Link 
        href="/clients" 
        className="inline-flex items-center text-sm font-medium text-accent hover:text-accent-hover mb-6 transition-colors"
      >
        <ChevronLeft size={16} className="mr-1" />
        {t('clientDetails.back')}
      </Link>

      <div className="flex flex-col md:flex-row items-start gap-4">
        
        {/* Avatar Placeholder / Skeleton */}
        {loading ? (
          <Skeleton 
            variant="rectangular" 
            width={64} 
            height={64} 
            className="rounded-xl" 
            animation="wave"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-surface-muted flex items-center justify-center text-muted-foreground border border-border">
            <User size={32} />
          </div>
        )}

        {/* Info Principal */}
        <div className="flex-1 w-full">
          
          {/* Nombre / Title Skeleton */}
          <div className="flex items-center">
            {loading ? (
              <Skeleton variant="text" width="60%" height={40} animation="wave" />
            ) : (
              <h1 className="text-2xl font-bold text-foreground">{name}</h1>
            )}
          </div>
          
          {/* Email & Company / Text Skeletons */}
          <div className="text-muted-foreground mt-1">
            {loading ? (
              <div className="flex flex-col gap-1 mt-1">
                <Skeleton variant="text" width="40%" height={20} animation="wave" />
                <Skeleton variant="text" width="30%" height={15} animation="wave" />
              </div>
            ) : (
              <>
                <p>{email}</p>
                {companyName && companyName !== name && (
                  <p className="text-sm opacity-80">{companyName}</p>
                )}
              </>
            )}
          </div>

          {/* Meta Data & Copy ID */}
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground h-6">
            {loading ? (
              <Skeleton variant="text" width={300} height={20} animation="wave" />
            ) : (
              <>
                <span className="font-mono">ID {id}</span>
                <span className="w-1 h-1 rounded-full bg-border"></span>
                <span>{t('clientDetails.created_at', { date: createdAt ? createdAt.split('T')[0] : '' })}</span>
                
                <button 
                  onClick={handleCopyId}
                  className={`
                    flex items-center cursor-pointer gap-1 ml-2 font-medium transition-colors duration-200
                    ${copied ? 'text-green-600' : 'text-accent hover:text-accent-hover'}
                  `}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? t('clientDetails.copied') : t('clientDetails.copy_id')}
                </button>

                <button 
                  onClick={handleCopyEmail}
                  className={`
                    flex items-center cursor-pointer gap-1 ml-2 font-medium transition-colors duration-200
                    ${copiedEmail ? 'text-green-600' : 'text-accent hover:text-accent-hover'}
                  `}
                >
                  {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                  {copiedEmail ? t('clientDetails.copied') : t('clientActions.copy_email')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};