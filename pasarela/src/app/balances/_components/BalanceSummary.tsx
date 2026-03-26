import { useTranslation } from "react-i18next";
import { Skeleton } from "@mui/material";

interface BalanceSummaryProps {
  available: number;
  incoming: number;
  currency: string;
  onExtract: () => void;
  extractDisabled?: boolean;
  loading?: boolean; 
  total:number;
}

export const BalanceSummary = ({ 
  available, 
  incoming, 
  currency, 
  onExtract, 
  extractDisabled = false,
  loading = false,
  total, 
}: BalanceSummaryProps) => {
  const { t } = useTranslation();
  
  const safeTotal = total === 0 ? 1 : total; 
  const availablePercent = (available / safeTotal) * 100;
  const incomingPercent = (incoming / safeTotal) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
          {t('balances.title')} 
          {loading ? (
            <Skeleton variant="text" width={180} height={40} className="inline-block" />
          ) : (
            <span className="text-foreground">
              {available.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={onExtract}
            disabled={loading || extractDisabled}
            className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium text-foreground hover:bg-surface-muted transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('balances.extract_button')}
          </button>
        </div>
      </div>

      {/* Barra de Progreso (Desktop) / Gráfico (Móvil) */}
      <div className="w-full mb-6">
        
        {/* Desktop Line */}
        <div className="hidden md:block w-full">
          {loading ? (
            <Skeleton variant="rectangular" height={12} width="100%" sx={{ borderRadius: 999 }} />
          ) : (
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-surface-strong">
              <div style={{ width: `${availablePercent}%` }} className="bg-accent h-full" />
              <div style={{ width: `${incomingPercent}%` }} className="bg-muted-foreground/30 h-full" />
            </div>
          )}
        </div>

        {/* Mobile Circle */}
        <div className="md:hidden flex justify-center py-4">
           {loading ? (
             <Skeleton variant="circular" width={160} height={160} />
           ) : (
             <div 
               className="w-40 h-40 rounded-full relative"
               style={{
                 background: `conic-gradient(var(--accent) 0% ${availablePercent}%, var(--surface-strong) ${availablePercent}% 100%)`
               }}
             >
               <div className="absolute inset-4 bg-surface rounded-full flex items-center justify-center flex-col">
                  <span className="text-xs text-muted-foreground">{t('balances.available')}</span>
                  <span className="font-bold text-lg">{availablePercent.toFixed(0)}%</span>
               </div>
             </div>
           )}
        </div>

      </div>

      {/* Leyenda */}
      <div className="flex flex-col gap-3">
        {/* Fila Entrante */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-muted-foreground/30"></span>
            <span className="text-muted-foreground">{t('balances.incoming')}</span>
          </div>
          {loading ? (
            <Skeleton width={100} height={20} />
          ) : (
            <span className="font-bold text-foreground">
              {incoming.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
            </span>
          )}
        </div>

        {/* Fila Disponible */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent"></span>
            <span className="text-foreground">{t('balances.available')}</span>
          </div>
          {loading ? (
            <Skeleton width={100} height={20} />
          ) : (
            <span className="font-bold text-foreground">
              {available.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
