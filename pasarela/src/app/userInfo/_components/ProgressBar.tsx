'use client';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

interface ProgressBarProps {
  completedSteps: number;
  totalSteps: number;
  status: "false" | "pending" | "true" | undefined;
}

export const ProgressBar = ({ completedSteps, totalSteps, status }: ProgressBarProps) => {
  const { t } = useTranslation();
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="bg-surface rounded-xl border border-border p-6 mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
            <ShieldCheck className="text-accent w-5 h-5" />
            <h3 className="font-bold text-foreground">{t('userInfo.verificationStatus')}</h3>
        </div>
        <span className="text-sm font-semibold text-foreground">
          {completedSteps}/{totalSteps} {t('userInfo.sections')}
        </span>
      </div>

      <div className="w-full bg-surface-strong rounded-full h-2.5 mb-4">
        <div 
          className={`${completedSteps === totalSteps && status !== 'true' && 'bg-status-review'} ${status === 'true' && 'bg-status-active'}
        ${completedSteps > 0 && 'bg-status-restricted'} h-2.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <ShieldCheck className={` ${completedSteps === totalSteps && status !== 'true' && 'text-status-review'} ${status === 'true' && 'text-status-active'}
        ${completedSteps === 0 && 'text-status-suspended'}
        ${completedSteps > 0 && 'text-status-restricted'}
            w-4 h-4`} />
        <span className={`${completedSteps === totalSteps && status !== 'true' && 'text-status-review'} ${status === 'true' && 'text-status-active'}
        ${completedSteps === 0 && 'text-status-suspended'}
        ${completedSteps > 0 && 'text-status-restricted'} font-medium`}>
            {completedSteps === totalSteps 
                ? t('userInfo.allCompleted')  
                : t('userInfo.pendingSections', { count: totalSteps - completedSteps })}
        </span>
      </div>
      
      {completedSteps === totalSteps && status !== 'true' && (
        <p className="text-xs text-muted-foreground mt-1 ml-6">
          {t('userInfo.verificationInProgress')}
        </p>
      )}

      {status === 'true' &&  (
        <p className="text-xs text-muted-foreground mt-1 ml-6">
          {t('userInfo.completedDate')}
        </p>
      )}
    </div>
  );
};