'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, ChevronDown, CheckCircle, Circle, Dot, Disc } from 'lucide-react';
import { VERIFICATION_STEPS, REVIEW_STEP } from '@/lib/profileConstants';
import { VerificationStep } from '@/common/types/stepsProfileTypes';
import Image from 'next/image';

interface ProfileSidebarProps {
  currentStep: number;
  completedSteps: number[]; 
  onStepClick: (stepId: number) => void;
}

export const ProfileSidebar = ({ currentStep, completedSteps, onStepClick }: ProfileSidebarProps) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(currentStep !== REVIEW_STEP.id);

  useEffect(() => {
    if (currentStep === REVIEW_STEP.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(true);
    }
  }, [currentStep]);

  const isStepCompleted = (id: number) => completedSteps.includes(id);

  const renderStepIndicator = (stepId: number, isActive: boolean) => {
    if (isStepCompleted(stepId)) {
      return (
        <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0">
           <div className="w-2 h-2 bg-white rounded-full" /> 
        </div>
      );
    }
    if (isActive) {
       return <Disc className="text-accent w-5 h-5 shrink-0" />;
    }
    return <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />;
  };

  return (
    <div className="hidden lg:flex flex-col w-72 h-full bg-surface border-r border-border p-6 fixed left-0 top-0 overflow-y-auto">
      <div className="mb-8 flex items-center gap-2 font-bold text-xl text-foreground">
         <div className="h-11 w-11 flex items-center justify-center">
            <Image
              src="/pasarela/logo.png"
              alt="AntillaPay Logo"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
        <span>{t('nav.brand')}</span>
      </div>


      <div className="space-y-2">
        {/* 1. SECCIÓN: Verifica tu empresa (Desplegable) */}
        <div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-between w-full cursor-pointer p-2 hover:bg-surface-muted rounded-lg transition-colors group text-left"
          >
            <div className="flex items-center gap-3 font-semibold text-foreground">
               <div className={` ${currentStep < 6 ? 'animate-spin' : ''} w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center`}>
                 {currentStep < 6 ?
                   <Loader2 size={14}/>
                   :
                   <Disc className="text-border-strong w-5 h-5 shrink-0" />
                 }
                
               </div>
               <span>{t('profile.verifyCompany')}</span>
            </div>
            {/* Si todos los pasos internos están completados, mostrar check verde/azul en el padre */}
            {VERIFICATION_STEPS.every(s => isStepCompleted(s.id)) ? (
                <CheckCircle size={16} className="text-status-active" />
            ) : (
                <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Pasos Internos (Collapsible) */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
             <div className="pl-4 ml-3 border-l-2 border-border my-2 space-y-4 py-2">
                {VERIFICATION_STEPS.map((step) => {
                  const isActive = currentStep === step.id;
                  const canNavigate = isStepCompleted(step.id) || step.id === currentStep || isStepCompleted(step.id - 1) || step.id === 1;

                  return (
                    <button
                      key={step.id}
                      onClick={() => onStepClick(step.id)}
                      disabled={!canNavigate}
                      className={`flex items-center gap-3 w-full cursor-pointer text-left transition-colors relative group
                        ${isActive ? 'text-accent font-medium' :  'text-foreground hover:text-accent' }
                        ${!canNavigate ? 'cursor-not-allowed text-muted-foreground/50' : ''}
                      `}
                    >
                        {renderStepIndicator(step.id, isActive)}
                        <span className="text-sm">{t(step.label)}</span>
                    </button>
                  );
                })}
             </div>
          </div>
        </div>

        {/* 2. SECCIÓN: Revisar y enviar (Botón directo) */}
        <button
            onClick={() => {
               onStepClick(REVIEW_STEP.id);
            }}
            disabled={!VERIFICATION_STEPS.every(s => isStepCompleted(s.id))}
            className={`flex items-center gap-3 w-full cursor-pointer p-2 rounded-lg transition-colors text-left
                ${currentStep === REVIEW_STEP.id ? 'bg-accent/10 text-accent font-semibold' : 'hover:bg-surface-muted text-foreground'}
                ${!VERIFICATION_STEPS.every(s => isStepCompleted(s.id)) ? 'cursor-not-allowed text-muted-foreground/50' : ''}
            `}
        >
             <div className={`w-6 h-6 rounded-full flex items-center justify-center
                ${currentStep === REVIEW_STEP.id ? 'bg-accent text-white' : 'bg-surface-strong text-muted-foreground'}
                ${!VERIFICATION_STEPS.every(s => isStepCompleted(s.id)) ? 'bg-muted-foreground/30 text-muted-foreground/50' : ''}
             `}>
                  {currentStep === REVIEW_STEP.id ? <CheckCircle size={14} /> : <Circle size={14} />}
             </div>
             <span>{t(REVIEW_STEP.label as VerificationStep)}</span>
        </button>
      </div>
    </div>
  );
};
