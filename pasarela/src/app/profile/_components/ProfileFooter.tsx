'use client';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

interface ProfileFooterProps {
  currentStep: number;
  isLastStep: boolean;
  onNext: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const ProfileFooter = ({
  currentStep,
  isLastStep,
  onNext,
  loading = false,
  disabled = false,
}: ProfileFooterProps) => {
  const { t } = useTranslation();

  return (
    <footer className="h-20 border-t border-border bg-surface px-6 flex items-center justify-end sticky bottom-0 z-10 lg:static">
      <button
        onClick={onNext}
        disabled={loading || disabled}
        className="px-6 py-2.5 cursor-pointer bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {isLastStep ? t('profile.activate') : t('profile.continue')}
      </button>
    </footer>
  );
};
