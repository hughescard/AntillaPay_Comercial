'use client';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { VERIFICATION_STEPS } from '@/lib/profileConstants';
import { VerificationStep } from '@/common/types/stepsProfileTypes';

interface ProfileHeaderProps {
  currentStep: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const ProfileHeader = ({ currentStep, onClose, onPrev, onNext }: ProfileHeaderProps) => {
  const { t } = useTranslation();
  const currentStepData = VERIFICATION_STEPS.find(s => s.id === currentStep);
  
  const totalSteps = VERIFICATION_STEPS.length;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <header className="relative h-16 border-b border-border bg-surface px-4 flex items-center justify-between sticky top-0 z-10 lg:static">
      
      {/* Mobile Nav Controls (< lg) */}
      <div className="flex items-center gap-2 lg:hidden">
        {currentStep > 1 && (
            <button onClick={onPrev} className="p-2 text-muted-foreground hover:bg-surface-muted rounded-full cursor-pointer">
              <ChevronLeft size={20} />
            </button>
        )}
        <span className="text-xs font-medium text-muted-foreground">
            {t('profile.step', { current: currentStep, total: totalSteps })}
        </span>
        {currentStep < totalSteps && (
            <button onClick={onNext} className="p-2 text-muted-foreground hover:bg-surface-muted rounded-full cursor-pointer">
              <ChevronRight size={20} />
            </button>
        )}
      </div>

      <div className="hidden lg:block ml-4">
         <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
             {t('profile.verifyCompany')} / <span className="text-accent">{t(currentStepData?.label as VerificationStep)}</span>
         </span>
      </div>

      <button onClick={onClose} className="p-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
        <X size={24} />
      </button>

      <div className="absolute bottom-0 left-0 w-full h-1 flex lg:hidden">
        <div 
          className="bg-accent h-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progressPercentage}%` }} 
        />
        <div className="bg-surface-strong h-full flex-1" />
      </div>

    </header>
  );
};