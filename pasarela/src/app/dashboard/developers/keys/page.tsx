'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Eye, EyeOff, RotateCw, Check } from 'lucide-react';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { SurfaceCard } from '@/common/components/ui/SurfaceCard';
import { GenericTable } from '@/common/components/ui/GenericTable';
import { Skeleton } from '@mui/material';
import { ApiKeyRecord, useApiKeys } from '../_hooks/useApiKeys';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import { useRbacSimulation } from '@/common/context';

const API_KEYS_COLUMNS = [
  { key: 'name', label: 'developers.keys.table.name', visible: true, order: 0 },
  { key: 'token', label: 'developers.keys.table.token', visible: true, order: 1 },
  { key: 'createdAt', label: 'developers.keys.table.created', visible: true, order: 2 },
  { key: 'lastUsed', label: 'developers.keys.table.lastUsed', visible: true, order: 3 }
];

export default function ApiKeysPage() {
  const { t } = useTranslation();
  const { hasPermission } = useRbacSimulation();
  const canManageApiKeys = hasPermission('manage_api_keys');
  const { keys, loading, regenerateKeys, getKeys } = useApiKeys();
  
  const [showSecret, setShowSecret] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (token: string, id: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setCopiedId(null);
    }
  };

  useEffect(()=>{
    const fetchKeys = async () => await getKeys();
    fetchKeys();
  },[])

  console.log(keys)

  const renderCell = (item: ApiKeyRecord, key: string) => {
    switch (key) {
      case 'name':
        return (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">
                {item.type === 'secret' ? t('dashboard.apiKeys.secret') : t('dashboard.apiKeys.publishable')}
              </span>
              {item.type === 'secret' && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-bold text-amber-700 tracking-wide">
                  {t('developers.keys.sensitive')}
                </span>
              )}
            </div>
            <div className="mt-1.5">
              <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                {item.type === 'secret' ? 'sk_test' : 'pk_test'}
              </span>
            </div>
          </div>
        );

      case 'token':
        const maskedToken = '•'.repeat(30);
        const displayToken = item.type === 'secret' && !showSecret ? maskedToken : item.token;
        
        return (
          <div className="flex flex-col items-start justify-start w-full">
            <div className="flex items-center gap-3 w-full max-w-105">
              {/* Input Box */}
              <div className="flex flex-1 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-sm min-w-0 h-9">
                <span className="font-mono text-xs tracking-wider text-slate-800 overflow-hidden text-ellipsis whitespace-nowrap">
                  {displayToken}
                </span>
                {item.type === 'secret' && (
                  <button
                    type="button"
                    onClick={() => setShowSecret((prev) => !prev)}
                    className="ml-2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors shrink-0"
                    aria-label={showSecret ? t('developers.keys.hide', 'Ocultar') : t('developers.keys.show', 'Mostrar')}
                  >
                    {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
              
              {/* Botón de copiar */}
              <div className="relative flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(item.token, item.id)}
                  className="flex items-center justify-center w-9 h-9 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors border border-slate-200 rounded-md bg-white hover:bg-slate-50 shadow-sm"
                  title={t('developers.keys.copy')}
                >
                  {copiedId === item.id ? (
                    <Check size={16} className="text-emerald-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                {/* Mensaje animado */}
                {copiedId === item.id && (
                  <span className="absolute left-full ml-2 text-xs font-medium text-emerald-600 animate-in fade-in duration-200 whitespace-nowrap">
                    {t('developers.keys.copied', '¡Copiado!')}
                  </span>
                )}
              </div>
            </div>
            
            {/* Advertencia de clave secreta */}
            <div className="h-5 mt-1.5 w-full">
              {item.type === 'secret' && (
                <p className="text-[11px] font-medium text-amber-600 text-left">
                  {t('developers.keys.secretHint')}
                </p>
              )}
            </div>
          </div>
        );

      case 'createdAt':
        return <span className="text-slate-500 text-sm">{item.createdAt.split('T')[0]}</span>;

      case 'lastUsed':
        return (
          <span className="text-slate-500 text-sm">
            {item.lastUseAt !== '--' ?  
            formatRelativeTime(item.lastUseAt,
            {hoursLabel: t('dashboard.apiKeys.hours'),
            hourLabel: t('dashboard.apiKeys.hour'),
            minutesLabel: t('dashboard.apiKeys.minutes'),
            minuteLabel: t('dashboard.apiKeys.minute'),
            yesterdayLabel: t('dashboard.apiKeys.yesterday')
            }) 
            : '--'}
          </span>
        );

      default:
        return null;
    }
  };

  return (
    <div className="lg:flex h-full min-h-0 overflow-hidden animate-enter-step">
      <Navbar />
      <div className="min-w-0 flex-1 min-h-0 flex flex-col">
        <Header />
        <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
          <div className="mx-auto w-full space-y-8">
            
            {/* Texto introductorio */}
            <div className="text-sm text-muted-foreground">
              {t('developers.keys.subtitle', 'Usa estas claves para autenticar tus solicitudes a la API. Aprende más sobre la ')}
              <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                {t('developers.keys.authLink')}
              </Link>
              .
            </div>

            <SurfaceCard className="p-0 overflow-hidden bg-white shadow-sm border border-border rounded-lg">
              <div className="p-6">
                
                {/* Encabezado de la tabla */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-bold text-slate-800">
                    {t('developers.keys.sectionTitle')}
                  </h2>
                  <button
                    type="button"
                    onClick={regenerateKeys}
                    disabled={!canManageApiKeys}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RotateCw size={14} className="text-slate-500" />
                    {t('developers.keys.regenerate')}
                  </button>
                </div>

                {loading ? (
                  <Skeleton animation="wave" width="100%" height={150} />
                ) : keys.length > 0 ? (
                  <GenericTable<ApiKeyRecord>
                    data={keys}
                    columns={API_KEYS_COLUMNS}
                    renderCellContent={renderCell}
                    hideMenu={true}
                  />
                ) : (
                  <p className="w-full text-center py-12 text-muted-foreground bg-surface-muted/10 rounded-lg border border-dashed border-border">
                    {t('common.resultsNotFound')}
                  </p>
                )}

              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>
    </div>
  );
}
