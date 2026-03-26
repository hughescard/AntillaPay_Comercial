'use client';
import { useTranslation } from 'react-i18next';

interface ReviewSectionProps {
  title: string;
  onEdit: () => void;
  editable?: boolean;
  children: React.ReactNode;
}

export const ReviewSection = ({
  title,
  onEdit,
  editable = true,
  children,
}: ReviewSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-xl p-6 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-bold text-foreground">{t(title as 'profile.fiscalData' | 'profile.companyData')}</h3>
        {editable ? (
          <button
            onClick={onEdit}
            className="px-4 cursor-pointer py-1.5 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent-soft transition-colors"
          >
            {t('common.edit')}
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        {children}
      </div>
    </div>
  );
};

export const ReviewField = ({ label, value }: { label: string, value: string | null }) => {
    const { t } = useTranslation();
    return(
    <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</span>
        <span className="text-sm font-medium text-foreground wrap-break-word">
        {value || <span className="text-muted-foreground/50 italic">{t('profile.noValue')}</span>}
        </span>
    </div>
)};
